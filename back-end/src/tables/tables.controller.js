const tablesService = require("./tables.service");
const reservationsService =require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const {hasData,
       hasOnlyValidProperties,
       hasRequiredProperties, 
       hasValidTableName, 
       hasValidCapacity,
       hasValidSeatRequest} = require("./tables.validations");

async function tableExists(req, res ,next){
    const { table_id } = req.params;
    const table = await tablesService.read( table_id );
    if (table) {
     res.locals.table = table;
     return next();
    }
    next({ status: 404,
           message: `Table ${table_id} cannot be found.`
         });
}

async function create(req, res) {
    console.log( "tables.controller - req.body.data: ", req.body.data);
    const table = req.body.data;
    const data = await tablesService.create(table);
    console.log( "tables.controller - req.body.data: ", req.body.data);
      
    res.status(201).json({ data });
}
 

async function list(req, res) {
    const data = await tablesService.list();
    res.json({ data });
  }


async function updateSeat(req, res, next) {

    const { table_id } = req.params;
    const { reservation_id } = req.body.data;
    const table = res.locals.table;
    
    if (!table) {
      return next({ status: 404, 
                    message: `Table ${table_id} not found` });
    }
  
    if(!reservation_id) {
      return next({ status: 400, 
                    message:  "reservation_id is missing" })
    }
    
    if (table.reservation_id) {
      return next({ status: 400, 
                    message: `Table ${table_id} is already occupied` });
    }
      
    const reservation = await reservationsService.read(reservation_id);
  
    if (!reservation) {
      return next({ status: 404, 
                    message: `Reservation ${reservation_id} cannot be found` });
    }
  
    if (reservation.people > table.capacity) {
      return next({ status: 400, 
                    message: "Table capacity is less than the number of people in the reservation" });
    }
  
    if(reservation.status === "seated") {
      return next({
        status: 400,
        message: "Reservation is already seated"
      });
    }
    await tablesService.updateSeat(table_id, {reservation_id});
    await reservationsService.updateStatus(reservation_id, "seated");
    res.status(200).json({ data: { status: "seated"} });
  
  }
  
  async function clearTable(req, res, next) {
    const table = res.locals.table;
    const { table_id } = req.params;
  
    if(!table.reservation_id) {
      return next({ status: 400,
                    message: `Table ${table_id} is not occupied.`,
                  });
    }
    
    await tablesService.clearTable(table_id);
   
    res.json({ data: { status: "finished" } });
  }
  
module.exports = {
    create: [hasData,
             //hasOnlyValidProperties,
             hasRequiredProperties, 
             hasValidTableName, 
             hasValidCapacity, 
             asyncErrorBoundary(create)],
    list: [asyncErrorBoundary(list)],
    updateSeat: [asyncErrorBoundary(tableExists),
                 hasData,
                 hasValidSeatRequest,
                 asyncErrorBoundary(updateSeat)],
    clearTable: [asyncErrorBoundary(tableExists),
                 asyncErrorBoundary(clearTable)],
};