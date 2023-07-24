const { Router } = require("express");
const { sign_in, sign_up } = require("../controller/userController");
const permissionChecker = require("../tools/permissionChecker");
const router = Router();

router.post("/sign-in", sign_in);
router.post("/sign-up", permissionChecker, sign_up);

module.exports = router;
