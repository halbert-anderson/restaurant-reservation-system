import React from "react";
import TablesTable from "../table/TablesTable";


function DisplayTables({tables}) {


return ( <div>
          <h2>Tables</h2>
          <TablesTable tables={tables}  />
        </div>);
        
}
export default DisplayTables;