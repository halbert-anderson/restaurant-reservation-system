/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { hasOnlyValidProperties,
        hasRequiredProperties,
        hasData,
        hasReservationId,
        hasValidFirstAndLastName,
        hasValidMobileNumber,
        hasValidTime,
        hasValidDate,
        hasValidPeople,
        hasValidStatus,
        isBooked, } =   require("./reservationsValidations")


async function reservationExists(req, res, next) {
  const {reservation_id}= req.params;
  const foundReservation = await reservationsService.read(reservation_id);
  if (foundReservation) {
    res.locals.reservation = foundReservation;
    return next();
  }
  return next({ status: 404,
                message: `reservation_id ${reservation_id} cannot be found: `,});
};
      

async function create(req, res) {
  const reservation = req.body.data;
  const newReservation = await reservationsService.create(reservation);
  console.log("create - New Reservation: ",newReservation);
  res.status(201)
     .json({ data: newReservation });
}

async function list(req, res) {
  
  const  { date, mobile_number } = req.query;
  const data = await (date? reservationsService.list(date)
                         : reservationsService.search(mobile_number));
  console.log("data: ",data);
  res.json({ data });
}

async function read(req, res) {
  const data = res.locals.reservation;
  res.json({ data });
}

async function update(req, res, next) {
  try{
    const reservation = req.body.data;
    const reservation_Id = res.locals.reservation.reservation_id;
    const updatedReservation = {...reservation, 
                                reservation_id: reservation_Id};
  
    const data = await reservationsService.update(updatedReservation);
    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function updateStatus(req, res) {
  const { status } = res.locals;
  const{ reservation_id }= res.locals.reservation;
  const data = await reservationsService.updateStatus(reservation_id, status);
  res.status(200).json({ data });
}



module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists),
         asyncErrorBoundary(read)],
  create: [ hasData,
            hasOnlyValidProperties,
            hasRequiredProperties,
            hasValidFirstAndLastName,
            hasValidMobileNumber,
            hasValidDate,
            hasValidTime,
            hasValidPeople,
            isBooked,
            asyncErrorBoundary(create)],
  update: [ hasData,
            asyncErrorBoundary(reservationExists),
            hasOnlyValidProperties,
            hasRequiredProperties,
            hasValidFirstAndLastName,
            hasValidMobileNumber,
            hasValidDate,
            hasValidTime, 
            hasValidPeople, 
            hasReservationId, 
            hasValidStatus,
            asyncErrorBoundary(update)],
  updateStatus: [asyncErrorBoundary(reservationExists),
                 hasReservationId,
                 hasValidStatus,
                 asyncErrorBoundary(updateStatus)],
  reservationExists,
  }



