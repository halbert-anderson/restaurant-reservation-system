import React from "react";
import { freeTable, listTables } from "../utils/api";
import TablesTable from "../table/TablesTable"

function DisplayTables({tables, setTables, setTablesError }) {
 
 
  async function finishHandler(table_id) {
    if (window.confirm('Is this table ready to seat new guests? This cannot be undone.')) {
        const abortController = new AbortController();
        try {
          await freeTable(table_id, abortController.signal);
          // Updates the UI by setting tables with most recent tables list
          const updatedTables = await listTables(abortController.signal);
          setTables(updatedTables);
        } 
        catch (error) {
          setTablesError(error);
        }
    }
  }

return ( <div>
          <h2>Tables</h2>
          <TablesTable tables={tables} finishHandler={finishHandler} />
        </div>);
        
}
export default DisplayTables;