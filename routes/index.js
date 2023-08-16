const { Router } = require("express");
const router = Router();

router.use("/user", require("./user_route"));
// Category
router.use("/flower/category", require("./category_route"));
// By Category
router.use("/flower/category", require("./flower_route"));
// Features
router.use("/features", require("./features_route"));

module.exports = router;
