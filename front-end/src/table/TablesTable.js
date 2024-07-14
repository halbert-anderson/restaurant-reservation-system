import React from "react";


function TablesTable({ tables, finishHandler }) {

  const columnHeadingsForTablesTable = (
    <tr>
        <th scope="col">Table Name</th>
        <th scope="col">Capacity</th>
        <th scope="col">Status</th>
    </tr>
  );  

  const rowsForTablesTable = tables.map((table) => (
    <tr key={table.table_id}>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={table.table_id}>
            {table.reservation_id ? "Occupied" : "Free"}
        </td>
        <td>{table.reservation_id ? (
             <button className="btn btn-primary"
                     type="button" 
                     data-table-id-finish={table.table_id}
                     onClick={() => finishHandler(table.table_id)}
              >
              Finish
              </button>) : null}
        </td>       
    </tr>
  ));

return (
        <table className="table">
            <thead>
                {columnHeadingsForTablesTable}
            </thead>
            <tbody>
                {rowsForTablesTable}
            </tbody>
        </table>
    );
}

export default TablesTable;