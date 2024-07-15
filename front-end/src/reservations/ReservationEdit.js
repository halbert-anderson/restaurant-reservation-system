import React, { useState, useEffect } from "react";
import { useHistory, useParams } from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert';
import ReservationForm from "../forms/ReservationForm";
import { updateReservation, readReservation } from "../utils/api";
import { formatAsDate, formatAsTime } from '../utils/date-time';

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
    const [reservationError, setReservationError] = useState(null);
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const { reservation_id } = useParams();
   
    useEffect(() => {
        const abortController = new AbortController();
    
        async function loadReservation() {
            try {
                const loadedReservation = await readReservation(reservation_id, abortController.signal);
                const formattedReservation = {...loadedReservation,
                                                 reservation_date: formatAsDate(loadedReservation.reservation_date),
                                                 reservation_time: formatAsTime(loadedReservation.reservation_time),
                                             };
                setReservation(formattedReservation);
            } 
            catch (error) {
                console.error("Loading reservation error:", error);
                setReservationError(error);
            } 
            finally {
                setIsLoading(false);
            }
        }
    
        loadReservation();
    
        return () => {
          abortController.abort();
        };
    }, [reservation_id]);

    async function submitHandler(event) {   
        event.preventDefault();
        const abortController = new AbortController(); 

        try {
            await updateReservation(reservation);
            history.push(`/dashboard?date=${reservation.reservation_date}`);
        } catch (error) {
            console.error("updateReservation error during form submission:", error);
            setReservationError(error);
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

    return (isLoading ? <p>Loading...</p> : (
        <div>
            <h3>Edit Reservation</h3>
            <ErrorAlert error={reservationError} />
            <ReservationForm reservation={reservation} changeHandler={changeHandler} submitHandler={submitHandler} />
        </div>
    ));
}

export default ReservationEdit;
