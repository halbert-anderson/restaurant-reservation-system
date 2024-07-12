const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const {hasData,
       tableExists,
       hasOnlyValidProperties,
       hasRequiredProperties, 
       hasValidTableName, 
       hasValidCapacity} = require("./tables.validations");

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

module.exports = {
    create: [hasData,
             //hasOnlyValidProperties,
             hasRequiredProperties, 
             hasValidTableName, 
             hasValidCapacity, 
             asyncErrorBoundary(create)],
    list: [asyncErrorBoundary(list)],
};