import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "../forms/ReservationForm";
import { hasValidDateAndTime } from "../validations/hasValidDateAndTime";
import { createReservation } from "../utils/api";
// import useSubmitHandler from "../hooks/useSubmitHandler";

function ReservationCreate() {
    const initialReservationFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
    };
    const [reservation, setReservation] = useState({...initialReservationFormState});  
    const [reservationErrors, setReservationErrors] = useState(null);
    const history = useHistory();

    // const {submitHandler, errors} = useSubmitHandler(createReservation, hasValidDateAndTime, onSuccess);
    // const {submitHandler, errors} = useSubmitHandler(createReservation, onSuccess);
    // setReservationErrors(errors);
    
    async function submitHandler(event) {   
        console.log("SUBMIT CALLED!");
        event.preventDefault();
        const abortController = new AbortController();
        const validationError = hasValidDateAndTime(reservation);
        console.log("ReservationCreate - validationError: ", validationError);
        console.log("Reservation Data on Submit: ", reservation);

        // if(Object.keys(validationError).length){
        //    return setReservationErrors(validationError)
        // }
        if (validationError) {
            setReservationErrors(validationError); 
            abortController.abort();
            return;
        }

        try {
            const newReservation = await createReservation(reservation, abortController.signal);
            history.push(`/dashboard?date=${newReservation.reservation_date}`);
        } catch (error) {
            console.error("createReservation error during form submission:", error);
            // Create an error object with a message property
            // const errorMessage = error.response?.data?.error || error.message || "Unknown error occurred.";
            setReservationErrors(error);
        } finally {
            abortController.abort();
        }
        // }
        // return () => abortController.abort();
    };
  
    

    function changeHandler(event) {
        const { name, value } = event.target;
        setReservation((previousReservation) => ({
            ...previousReservation,
            [name]: name === "people" ? Number(value) : value,
        }));
    }



    return( 
        <div>
          <h2 className="mb-3">Create Reservation</h2>
          <ErrorAlert error={reservationErrors} /> 
          <ReservationForm reservation={reservation} changeHandler={changeHandler} submitHandler={submitHandler} />
        </div>
    );
}

export default ReservationCreate;
