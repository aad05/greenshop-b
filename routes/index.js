const { Router } = require("express");
const router = Router();

router.use("/user", require("./user_route"));

module.exports = router;
