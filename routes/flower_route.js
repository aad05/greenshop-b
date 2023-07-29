const { Router } = require("express");
const permissionChecker = require("../tools/permissionChecker");
const verifyToken = require("../tools/tokenVerification");
const {
  get_by_category,
  post_by_category,
} = require("../controller/flowers/byCategoryController");
const router = Router();

router.get("/:category", permissionChecker, get_by_category);
router.post("/:category", permissionChecker, verifyToken, post_by_category);
// router.put("/", permissionChecker, verifyToken, put_category);
// router.delete("/", permissionChecker, verifyToken, delete_category);

module.exports = router;
