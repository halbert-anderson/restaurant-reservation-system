import React, { useState, useEffect } from "react";
import { useHistory, useParams } from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert';
import ReservationForm from "../forms/ReservationForm";


function ReservationEdit() {

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
    const { reservation_id } = useParams();

    async function submitHandler(event) {   
      
        event.preventDefault();
        const abortController = new AbortController(); 

        try {
            await updateReservation(reservation);
            history.push(`/dashboard?date=${reservation.reservation_date}`);        
        } catch (error) {
            console.error("createReservation error during form submission:", error);
            setReservationErrors(error);
        } finally {
            abortController.abort();
        }
  
    };

    function changeHandler(event) {
        const { name, value } = event.target;
        setReservation((previousReservation) => ({
            ...previousReservation,
            [name]: name === "people" ? Number(value) : value,
        }));
    }
return(
    <h3>Edit Reservation</h3>
    <ErrorAlert error={reservationErrors} />
    <ReservationEdit reservation={reservation} changeHandler={changeHandler} submitHandler={submitHandler} />
)   
}
 export default ReservationEdit;