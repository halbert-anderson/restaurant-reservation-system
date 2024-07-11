const knex = require("../db/connection");

async function list(date) {
  return knex("reservations")
          .select("*")
          .where({reservation_date: date} )
          // .whereNot({ status: 'finished' })
          .orderBy("reservation_time","asc");
}

function create(newReservation) {
  return knex("reservations")
          .insert(newReservation)
          .returning("*")
          .then((createdRecords) => createdRecords[0]);
}

module.exports = {
  list, create
};