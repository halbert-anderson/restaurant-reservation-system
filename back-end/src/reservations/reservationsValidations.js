const hasProperties = require("../errors/hasProperties");

const VALID_PROPERTIES = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
    "status",
    // "reservation_id",
    // "created_at",
    // "updated_at",
  ];
  

  function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;
  
    const invalidFields = Object.keys(data).filter(
      (field) => {console.log( "props: ",field)
        const isItValid = !VALID_PROPERTIES.includes(field)
        console.log("Is it not! Valid: ",isItValid);
        return isItValid;}
      );
  
    if (invalidFields.length) {
      return next({ status: 400,
                    message: `Invalid field(s): ${invalidFields.join(', ')}`,
             });
    }
    return next();
  }
  
  
  function hasRequiredProperties(req, res, next) {
    const requiredFields = [
      "first_name",
      "last_name",
      "mobile_number",
      "reservation_date",
      "reservation_time",
      "people",
    ];
    const { data = {} } = req.body;
    const missingFields = requiredFields.filter((field) => !data[field]);
  
    if (missingFields.length) {
      return next({ status: 400,
                    message: `Missing required field(s): ${missingFields.join(', ')}`,
             });
    }

    return next();
  }


function hasData(req, res, next) {
    console.log("hasData: ",req.body.data);
    if (req.body.data) {
      return next()
    }
    return next({ status: 400, 
                  message: "body must have data property" });
}


function hasReservationId(req,res,next) {
    const reservation_Id = req.params.reservation_id || req.body?.data?.reservation_id;
    if(reservation_Id){
      res.locals.reservation_id = reservation_Id
      return next();
    }else{
      return next({ status: 404,
                    message: `reservation id not found: ${reservation_Id}`,
      });
    }
}





function hasValidFirstAndLastName(req, res, next) {
    const regName =/^[a-zA-Z0-9'-. ]+$/;
    const { first_name, last_name } =req.body.data;
    console.log("firstAndLastNameAreValid - First Name:", first_name, " Last Name: ",last_name);
    if(!regName.test(first_name)){
      next({ status: 400, 
             message: "Must include valid first_name."})
    }
  
    if(!regName.test(last_name)){
      next({ status: 400, 
             message: "Must include valid last_name." })
    }
  
    return next();
}


function hasValidMobileNumber(req, res, next) {
    const { mobile_number } = req.body.data;
    const regMobileNum = /^\d{3}-\d{3}-\d{4}$/
    console.log("mobileNumberIsValid: ", mobile_number);
    if(!regMobileNum.test(mobile_number)){
      next({ status: 400, 
             message: "Must include valid mobile_number (ex. ddd-ddd-dddd)." })
    }
    return next();
}



function hasValidDate(req, res, next) {
    const { reservation_date, reservation_time } = req.body.data;
    const regDate = /^\d{4}\-\d{1,2}\-\d{1,2}$/;
    console.log("ReservationDateIsValid: ", reservation_date);
    
    if(!regDate.test(reservation_date)){
       next({ status: 400, 
             message: "Must include valid reservation_date (ex. dd/mm/yyyy)." })
    }

    // No reservations on Tuesdays
    const day = new Date(reservation_date).getUTCDay();
    if (day === 2) {
       next({ status: 400, 
             message: "Restaurant is closed on Tuesdays." });
    }
    // No reservations in the past
    const formattedDate = new Date(`${reservation_date}T${reservation_time}`);
    if (formattedDate <= new Date()) {
       next({ status: 400, 
              message: "Reservation must be in the future." } );
    }
    return next();
}



function hasValidTime(req, res, next) {
    const { reservation_time } = req.body.data;
    const regTime = /^(?:[01]\d|2[0-3]):[0-5]\d$/; 
      
    if (!regTime.test(reservation_time)) {
         return next({ status: 400, 
                       message: "Must include valid reservation_time (ex. HH:mm for 24-hour format)." });
    }
  
    const [hours, minutes] = reservation_time.split(':').map(Number);
  
    if (hours < 10 || (hours === 10 && minutes < 30)) {
         return next({ status: 400, 
                       message: "Reservation must be after 10:30AM." });
    }    
  
    if (hours > 21 || (hours === 21 && minutes > 30)) {
         return next({ status: 400, 
                       message: "Reservation must be before 9:30PM." });
    }
    
    return next();
}
  


function hasValidPeople(req, res, next) {
    const { people } = req.body.data;
    console.log("peopleIsValid:", people);

    // Check if people is not a number
    if (!Number.isInteger(people)) {
      return next({ status: 400, 
                    message: "people must be an integer" });
    }
    
    // Check if people is less than 1
    if (people < 1) {
      return next({ status: 400, 
                    message: "Must have 1 or more people ." });
    }
    
    // If validation passes
    return next();
}


function hasValidStatus(req, res, next) {
    const { status } = req.body.data;
    const currentStatus = res.locals.reservation.status;
    if( currentStatus === "finished" || currentStatus ==="cancelled") {
     return next({ status: 400,
                   message: `Reservation status is finished.`
                 });
    }
    if (["booked", "seated", "finished", "canceled"].includes(status)) {
        res.locals.status = status;
        return next();
    }
    return next({ status: 400,
                  message: `Status is not valid; ${status0}`
    });
}


function isBooked(req, res, next) {
    const { status } = req.body.data;
  
    if(status && status !== "booked") {
      return next({ status: 400,
                    message: `Booked status is not valid: ${status}`
      });
    }
    next();
}
module.exports = {
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasData,
    hasReservationId,
    hasValidFirstAndLastName,
    hasValidMobileNumber,
    hasValidDate,
    hasValidTime,
    hasValidPeople,
    hasValidStatus,
    isBooked,
};