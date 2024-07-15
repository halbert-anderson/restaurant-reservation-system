import React, { useEffect, useState } from "react";
import { listReservations, listTables, freeTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, previous, next } from "../utils/date-time";
import DateButtons from "./DateButtons";
import DisplayReservations from "./DisplayReservations";
import DisplayTables from "./DisplayTables";

/**
 * Defines the dashboard page.
 * @param {string} date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadDashboard() {
      try {
        const reservationList = await listReservations({ date }, abortController.signal);
        setReservations(reservationList);
      } catch (error) {
        console.error("listReservations error:", error);
        setReservationsError(error);
      }

      try {
        const tableList = await listTables(abortController.signal);
        setTables(tableList);
      } catch (error) {
        console.error("listTables error:", error);
        setTablesError(error);
      }
    }

    loadDashboard();

    return () => {
      abortController.abort();
    };
  }, [date]);

  async function finishHandler(table_id) {
    if (window.confirm('Is this table ready to seat new guests? This cannot be undone.')) {
        const abortController = new AbortController();
        try {
          await freeTable(table_id, abortController.signal);
          // Updates the UI by setting tables with most recent tables list
          const updatedTables = await listTables(abortController.signal);
          setTables(updatedTables);
          const reservationList = await listReservations({ date }, abortController.signal);
          setReservations(reservationList);
        } 
        catch (error) {
          setTablesError(error);
        }
    }
  }
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date {date}</h4>
      </div>
      <DateButtons
        previous={`/dashboard?date=${previous(date)}`}
        today={`/dashboard?date=${today()}`}
        next={`/dashboard?date=${next(date)}`}
        date={date}
      />
      <ErrorAlert error={reservationsError} />
      <DisplayReservations reservations={reservations} setReservations={setReservations} setReservationsError={setReservationsError} />
      <ErrorAlert error={tablesError} />
      <DisplayTables tables={tables} finishHandler={finishHandler} />
    </main>
  );
}

export default Dashboard;
