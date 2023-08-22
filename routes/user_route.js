const { Router } = require("express");
const {
  sign_in,
  sign_up,
  get_wishlist,
  create_wishlist,
  delete_wishlist,
} = require("../controller/userController");
const permissionChecker = require("../tools/permissionChecker");
const verifyToken = require("../tools/tokenVerification");
const router = Router();

router.post("/sign-in", permissionChecker, sign_in);
router.post("/sign-up", permissionChecker, verifyToken, sign_up);
router.get("/wishlist", permissionChecker, verifyToken, get_wishlist);
router.post(
  "/create-wishlist",
  permissionChecker,
  verifyToken,
  create_wishlist
);
router.delete(
  "/delete-wishlist",
  permissionChecker,
  verifyToken,
  delete_wishlist
);

module.exports = router;
