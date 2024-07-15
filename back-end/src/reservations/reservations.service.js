const knex = require("../db/connection");

async function list(date) {
  return knex("reservations")
          .select("*")
          .where({reservation_date: date} )
          .whereNot({ status: "finished" })
          .orderBy("reservation_time","asc");
}

function create(newReservation) {
  return knex("reservations")
          .insert(newReservation)
          .returning("*")
          .then((createdRecords) => createdRecords[0]);
}

function read(reservation_id) {
  return knex("reservations")
          .select("*")
          .where({ reservation_id })
          .first();
}

function updateStatus(reservation_id, status) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .update({ status })
    .returning("*")  
    .then((updatedRecords) => updatedRecords[0]);  
}
 
function search(mobile_number) {
  return knex("reservations")
   .select("*")
   .whereRaw(
    "translate(mobile_number, '() -', '') like ?",
    `%${mobile_number.replace(/\D/g, "")}%`
  )
   .orderBy("reservation_date");
}

module.exports = {
  list, create, read, updateStatus, search
};