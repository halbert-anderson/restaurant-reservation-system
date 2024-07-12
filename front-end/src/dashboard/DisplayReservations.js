import React from "react";
import ReservationsTable from "../table/ReservationsTable";

function DisplayReservations({reservations}) {


return ( <div>
          <h2>Reservations</h2>
         <ReservationsTable reservations={reservations}  />
        </div>);
}
export default DisplayReservations;