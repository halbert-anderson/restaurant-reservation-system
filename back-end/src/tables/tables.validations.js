const hasProperties = require("../errors/hasProperties");

//========================validation middleware===============================

const hasRequiredProperties = hasProperties("table_name","capacity");


const VALID_PROPERTIES = ["table_name", 
                          "capacity",
                          /*,"reservation_id",*/
                        ];


function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;
    const invalidFields = Objest.keys(data).filter((field) => !VALID_PROPERTIES.includes(field));
    if(invalidFields.length) {
      return next({ status : 400,
                    message: `Invlaid Field(s): ${invlaidFields.join(', ')}`,});
    }
    next();
}


function hasValidTableName(req, res, next) {
  const{ table_name } = req.body.data;
    if (table_name.length < 2 ) {
      return next({ status: 400, message: "table_name must be at least 2 characters long" });
    }
    next();
}


function hasValidCapacity(req, res, next) {
  const { capacity } = req.body.data;
  if ( !Number.isInteger(capacity) || capacity < 1) {
    return next({ status: 400, message: "capacity must be at least 1 person and a number" });
  }
  next();
}


function hasData(req, res, next) {
  console.log("hasData: ",req.body.data);
  if (req.body.data) {
    return next()
  }
  next({ status: 400, message: "body must have data property" })
}

function hasValidSeatRequest(req, res, next) {
    const { data = {} } = req.body;

  if (!data.reservation_id) {
    return next({
      status: 400,
      message: 'reservation_id is missing',
    });
  }

  next();
}


module.exports = {
    hasData,
    hasOnlyValidProperties,
    hasRequiredProperties, 
    hasValidTableName, 
    hasValidCapacity,
    hasValidSeatRequest};