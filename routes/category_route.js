const { Router } = require("express");
const permissionChecker = require("../tools/permissionChecker");
const verifyToken = require("../tools/tokenVerification");
const {
  get_categories,
  post_category,
  put_category,
  delete_category,
} = require("../controller/flowers/categoryController");
const router = Router();

router.get("/", permissionChecker, verifyToken, get_categories);
// router.post("/", permissionChecker, verifyToken, post_category);
// router.put("/", permissionChecker, verifyToken, put_category);
// router.delete("/", permissionChecker, verifyToken, delete_category);

module.exports = router;
