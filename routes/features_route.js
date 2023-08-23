const { Router } = require("express");
const permissionChecker = require("../tools/permissionChecker");
const {
  get_discount_flower,
} = require("../controller/features/flowerDiscount");
const { get_coupon_discount } = require("../controller/features/coupon");
const { email_subscription } = require("../controller/features");
const router = Router();

router.get("/discount", permissionChecker, get_discount_flower);
router.get("/coupon", permissionChecker, get_coupon_discount);
router.post("/email-subscribe", permissionChecker, email_subscription);

module.exports = router;
