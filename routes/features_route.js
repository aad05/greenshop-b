const { Router } = require("express");
const permissionChecker = require("../tools/permissionChecker");
const {
  get_discount_flower,
} = require("../controller/features/flowerDiscount");
const { get_coupon_discount } = require("../controller/features/coupon");
const router = Router();

router.get("/discount", permissionChecker, get_discount_flower);
router.get("/coupon", permissionChecker, get_coupon_discount);
// router.post("/", permissionChecker, verifyToken, post_category);
// router.put("/", permissionChecker, verifyToken, put_category);
// router.delete("/", permissionChecker, verifyToken, delete_category);

module.exports = router;
