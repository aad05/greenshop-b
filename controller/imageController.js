const { errorStatus500, bodyRequirer } = require("../errors");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: "dj28bsagl",
  api_key: "866449746593312",
  api_secret: "dfozwH9JSCG5zqR0iTpkHz6vuNw",
});

// Method: POST; Description: User sign in
const upload_image = async ({ body, file }, res) => {
  try {
    const image_url = await cloudinary.uploader.upload(file.path);
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("File deleted successfully");
    });

    res.status(200).json({
      message: "success",
      image_url,
    });
  } catch (error) {
    return errorStatus500(error, res);
  }
};

module.exports = { upload_image };
