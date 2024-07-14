import React from "react";
import ReservationsTable from "../table/ReservationsTable";

function DisplayReservations({ reservations, setReservations, setReservationsError }) {


return ( <div>
          <h2>Reservations</h2>
         <ReservationsTable reservations={reservations} setReservations={setReservations} setReservationsError={setReservationsError} />
        </div>);
}
export default DisplayReservations;