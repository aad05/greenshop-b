const { Router } = require("express");
const { upload_image } = require("../controller/imageController");
const verifyToken = require("../tools/tokenVerification");
const permissionChecker = require("../tools/permissionChecker");
const { v4 } = require("uuid");
const multer = require("multer");
const router = Router();
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, v4() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.use("/user", require("./user_route"));
// Order
router.use("/order", require("./order_route"));
// Category
router.use("/flower/category", require("./category_route"));
// By Category
router.use("/flower/category", require("./flower_route"));
// Features
router.use("/features", require("./features_route"));
router.post(
  "/upload",
  permissionChecker,
  verifyToken,
  upload.single("image"),
  upload_image
);

module.exports = router;
