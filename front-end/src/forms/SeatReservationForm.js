import React from "react";
import { useHistory } from "react-router-dom";

function SeatReservationForm({ tables, table_id, changeHandler, submitHandler }) {
  
  const history = useHistory();

  function cancelHandler() {
    history.goBack();
  }

  return (
    <form onSubmit={submitHandler} className="form-inline">
      <label htmlFor="table_id">Table Number:</label>
      <select className="form-control"
              name="table_id"
              id="table_id"
              value={table_id}
              onChange={changeHandler}
              required={true}
      >
        <option value="">Select a table</option>
        {tables.map((table) => (
            <option key={table.table_id} 
                    value={table.table_id}
            >
            {table.table_name} - {table.capacity}
            </option>))
        }
      </select>

      <div className="form-group mt-2">
        <button className="btn btn-primary"
                type="submit"
        >
        Submit
        </button>
        <button className="btn btn-secondary ml-2" 
                type="button"
                onClick={cancelHandler}
        >
        Cancel
        </button>
      </div>
    </form>
  );
}

export default SeatReservationForm;
