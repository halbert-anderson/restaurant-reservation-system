import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import TableForm from "../forms/TableForm";
import { createTable } from "../utils/api";
// import useSubmitHandler from "../hooks/useSubmitHandler";

function TableCreate() {

    const initialFormState = {
        table_name: "",
        capacity: 1,
    }
    const [table, setTable] = useState({ ...initialFormState });
    const [tableErrors, setTableErrors] = useState(null);
    const history = useHistory();

    // const onSuccess = (response) => "/dashboard";
    // const { submitHandler, errors } = useSubmitHandler(createTable, onSuccess);
    

 

    async function submitHandler(event) {   
      
        event.preventDefault();
        const abortController = new AbortController();
        
        try {
            await createTable(table, abortController.signal);
            history.push(`/dashboard`);
        } catch (error) {
            console.error("createTable error during form submission:", error);
            setTableErrors(error);
        } 
        finally {
            abortController.abort();
        }
  
    }
    
    function changeHandler(event) {
        const { name, value } = event.target;
        setTable((previousTable) => ({
            ...previousTable,
            [name]: name === "capacity" ? Number(value) : value,
        }));
    }

   
return (
    <div>
        <h3 className="mb-3">Table Assignment</h3>
        <ErrorAlert error={tableErrors} />
        <TableForm table={table} changeHandler={changeHandler} submitHandler={submitHandler} />     
    </div>
  );

}

export default TableCreate;