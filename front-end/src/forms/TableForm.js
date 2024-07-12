import React from "react";
import { useHistory } from "react-router-dom";



function TableForm({ table, changeHandler, submitHandler }) {
   
    const history = useHistory();

    function cancelHandler() {
        history.goBack();
    }

    
    

return (
    <form onSubmit={submitHandler} className="mb-4">
        <div className="mb-3">
                <label className="form-label" htmlFor="table_name">
                    Table Name
                </label>
                <input className="form-control"
                       id="table_name"
                       name="table_name"
                       type="text"
                       placeholder="Table Name"
                       minLength="2"
                       value={table.table_name}
                       onChange={changeHandler}
                       required={true}
                />
        </div>
           
        <div className="mb-3">
            <label className="form-label" htmlFor="capacity">
                Capacity
            </label>
            <input className="form-control"
                   id="capacity"
                   name="capacity"
                   type="number"
                   min= {1}
                   value={table.capacity}
                   onChange={changeHandler}
                   required={true}
            />
        </div>

        <div className="mb-3"> 
            <button className="btn btn-secondary mr-2"     
                    type="button" 
                    onClick={cancelHandler}
            >Cancel
            </button>
          
            <button className="btn btn-primary"
                    type="submit"
            >Submit
            </button>
        </div>    
    </form> 
);

}

export default TableForm;