const knex = require("../db/connection");

function create(table) {
  return knex("tables")
          .insert(table)
          .returning("*")
          .then((createdRecords) => createdRecords[0]);
}


function read(table_id) {
    return knex("tables")
            .select("*")
            .where({ table_id })
            .first();
  }


function list() {
    return knex("tables")
            .select("*")
            .orderBy("table_name");
  }


function updateSeat(table_id, updatedTable) {
    return knex("tables")
            .where({ table_id })
            .update( updatedTable )
            .returning("*")
            .then((updatedRecords) => updatedRecords[0]);
}


async function clearTable(table_id) {
    const transaction = await knex.transaction();
    try {
        const table = await transaction("tables")
            .select("*")
            .where({ table_id })
            .first();

        await transaction("tables")
            .where({ table_id })
            .update({ reservation_id: null, occupied: false }); 

        await transaction("reservations")
            .where({ reservation_id: table.reservation_id })
            .update({ status: "finished" });

        await transaction.commit();
        return read(table_id); 
    } catch (error) {
        await transaction.rollback();
        throw error;
    }    
}



module.exports = { create, 
                   list, 
                   read, 
                   updateSeat, 
                   clearTable,
  };