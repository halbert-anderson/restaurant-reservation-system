import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import SearchForm from "../forms/SearchForm";
import DisplayReservations from "../dashboard/DisplayReservations";

function Search() {

const [mobileNumber, setMobileNumber] = useState("");
const [reservations, setReservations] = useState([])
const [searchError, setSearchError] = useState(null);
const [noReservations, setNoReservations] = useState(false);


function changeHandler(event) {
      setMobileNumber(event.target.value);
}


async function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController(); 

    try {
        const reservationsByMobileNumber = await listReservations({ mobile_number: mobileNumber})
        setReservations(reservationsByMobileNumber); // All reservations for the mobile number are listed regardless of day or time 
        setNoReservations(reservationsByMobileNumber.length === 0);
        setSearchError(null);
    }
    catch (error) {
        setSearchError(error);
    }finally {
        abortController.abort();
    }
}

return (
        <>
            <h3>Search Reservations by Phone Number</h3>
            <ErrorAlert error={searchError} />
            <SearchForm mobileNumber={mobileNumber} changeHandler={changeHandler} submitHandler={submitHandler} />
            {noReservations ? ( <p>No reservations found</p> ) :
                              ( <DisplayReservations reservations={reservations} setReservations={setReservations} setReservationsError={setSearchError} />)
            }
        </>
        );
}
 export default Search;