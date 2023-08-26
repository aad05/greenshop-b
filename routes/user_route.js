const { Router } = require("express");
const {
  sign_in,
  sign_up,
  get_wishlist,
  create_wishlist,
  delete_wishlist,
  update_account_details,
  update_address,
  get_products,
  delete_product,
  get_user,
  follow_user,
  unfollow_user,
} = require("../controller/userController");
const permissionChecker = require("../tools/permissionChecker");
const verifyToken = require("../tools/tokenVerification");
const router = Router();

router.get("/by_id/:_id", permissionChecker, get_user);
router.post("/sign-in", permissionChecker, sign_in);
router.post("/sign-up", permissionChecker, verifyToken, sign_up);
router.post(
  "/account-details",
  permissionChecker,
  verifyToken,
  update_account_details
);
router.post("/address", permissionChecker, verifyToken, update_address);
// My Products
router.get("/products", permissionChecker, get_products);
router.delete(
  "/product/:category",
  permissionChecker,
  verifyToken,
  delete_product
);

// Wishlist
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

// Follow
router.post("/follow", permissionChecker, verifyToken, follow_user);
router.post("/unfollow", permissionChecker, verifyToken, unfollow_user);
module.exports = router;
