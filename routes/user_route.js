const { Router } = require("express");
const { sign_in, sign_up } = require("../controller/userController");
const router = Router();

router.post("/sign-in", sign_in);
router.post("/sign-up", sign_up);

module.exports = router;
