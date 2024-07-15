import React from "react";
import TablesTable from "../table/TablesTable"

function DisplayTables({tables, finishHandler }) {
 
 
 

return ( <div>
          <h2>Tables</h2>
          <TablesTable tables={tables} finishHandler={finishHandler} />
        </div>);
        
}
export default DisplayTables;