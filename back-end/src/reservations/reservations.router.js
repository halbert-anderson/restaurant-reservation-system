/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router({ mergeParams: true });
const controller = require("./reservations.controller");
const methodNotAllowed =require("../errors/methodNotAllowed");

router.route("/")
      .post(controller.create)
      .get(controller.list)
      .all(methodNotAllowed);


router.route("/:reservation_id")
      .get(controller.read)
      .all(methodNotAllowed);

      
router.route("/:reservation_id/status")
      .put(controller.updateStatus)
      .all(methodNotAllowed);

   module.exports = router;

