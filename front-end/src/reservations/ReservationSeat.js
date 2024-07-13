import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, seatReservation } from "../utils/api";
import SeatReservationForm from "../forms/SeatReservationForm";
import { hasValidTableIdAndReservationId } from "../validations/hasValidTableIdAndReservationId";

function ReservationSeat() {
    const [seatReservationErrors, setSeatReservationErrors] = useState(null);
    const [tables, setTables] = useState([]);
    const [table_id, setTable_id] = useState("");
    const { reservation_id } = useParams();
    const history = useHistory();

    useEffect(() => {
      const abortController = new AbortController();
      async function loadTables() {
        setSeatReservationErrors(null);
        setTables([]);
        try {
          const tablesList = await listTables(abortController.signal);
          setTables(tablesList);          
        } catch (error) {
          setSeatReservationErrors(error);  }
      }
      loadTables();
      return () => abortController.abort();
    }, []);
  
    const submitHandler = async (event) => {
        event.preventDefault();
        const abortController = new AbortController(); 
          
        const validationErrors = hasValidTableIdAndReservationId({table_id, reservation_id});
        if (Object.keys(validationErrors).length > 0) {
            setSeatReservationErrors(validationErrors);
            return;
        }
       
        try {
            await seatReservation(table_id, reservation_id, abortController.signal);
            history.push("/dashboard");
        } catch (error) {
            setSeatReservationErrors(error); 
        } finally {
            abortController.abort();
        }
    };

    const changeHandler = (event) => {
        setTable_id(event.target.value);
    };

    return (
        <div>
            <h3 className="mb-3">Seat Reservation</h3>
            <ErrorAlert errors={seatReservationErrors} />
            {tables.length > 0 ? (
                <SeatReservationForm tables={tables} table_id={table_id} changeHandler={changeHandler} submitHandler={submitHandler} />
            ) : (
                <p>Loading tables...</p>
            )}
        </div>
    );
}

export default ReservationSeat;
