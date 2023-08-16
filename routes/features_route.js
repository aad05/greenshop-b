const { Router } = require("express");
const permissionChecker = require("../tools/permissionChecker");
const {
  get_discount_flower,
} = require("../controller/features/flowerDiscount");
const router = Router();

router.get("/discount", permissionChecker, get_discount_flower);
// router.post("/", permissionChecker, verifyToken, post_category);
// router.put("/", permissionChecker, verifyToken, put_category);
// router.delete("/", permissionChecker, verifyToken, delete_category);

module.exports = router;
