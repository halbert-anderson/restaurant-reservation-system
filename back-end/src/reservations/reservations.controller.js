/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { hasOnlyValidProperties,
        hasRequiredProperties,
        reservationExists,
        hasData,
        hasReservationId,
        hasValidFirstAndLastName,
        hasValidMobileNumber,
        hasValidTime,
        hasValidDate,
        hasValidPeople,
        statusIsValid,
        isBooked, } =   require("./reservationsValidations")




async function create(req, res) {
  const reservation = req.body.data;
  const newReservation = await reservationsService.create(reservation);
  console.log("create - New Reservation: ",newReservation);
  res.status(201)
     .json({ data: newReservation });
}

async function list(req, res, next) {
  // console.log("req.query: ", req.query);
  const date = req.query.date
  // console.log("Date: ", date);
  const mobile_number = req.query.mobile_number;
  const data = await (date? reservationsService.list(date)
                         : reservationsService.search(mobile_number));
  // console.log("data: ",data);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),

  create: [ hasData,
            hasOnlyValidProperties,
            hasRequiredProperties,
            hasValidFirstAndLastName,
            hasValidMobileNumber,
            hasValidDate,
            hasValidTime,
            hasValidPeople,
            asyncErrorBoundary(create)],};



