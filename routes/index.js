const { Router } = require("express");
const router = Router();

router.use("/user", require("./user_route"));
// Categorty
router.use("/flower/category", require("./category_route"));

module.exports = router;
