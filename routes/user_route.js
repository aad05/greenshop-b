const { Router } = require("express");
const { sign_in, sign_up } = require("../controller/userController");
const permissionChecker = require("../tools/permissionChecker");
const verifyToken = require("../tools/tokenVerification");
const { make_order } = require("../controller/orderController");
const router = Router();

router.post("/sign-in", permissionChecker, sign_in);
router.post("/sign-up", permissionChecker, verifyToken, sign_up);
router.post("/make-order", permissionChecker, verifyToken, make_order);

module.exports = router;
