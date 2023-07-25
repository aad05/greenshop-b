const { Router } = require("express");
const { sign_in, sign_up } = require("../controller/userController");
const permissionChecker = require("../tools/permissionChecker");
const verifyToken = require("../tools/tokenVerification");
const router = Router();

router.post("/sign-in", permissionChecker, sign_in);
router.post("/sign-up", permissionChecker, verifyToken, sign_up);

module.exports = router;
