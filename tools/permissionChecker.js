const { errorStatus500 } = require("../errors");
const { user } = require("../models/userModel");

const access_token_error = {
  message: "error",
  extraMessage: "Request should be provided with access_token param!",
};

const access_token_not_found = {
  message: "error",
  extraMessage: "Your access token cannot be matched with our requirements!",
};

const access_token_create_not_allowed = {
  message: "error",
  extraMessage: "Your access_token is not valid for creating credentials!",
};

const access_token_sign_up_over_limited = {
  message: "error",
  extraMessage:
    "You've reached your limit. You can no longer sign up any users until you remove, some already signed up users.",
};

const access_token_update_not_allowed = {
  message: "error",
  extraMessage: "Your access_token is not valid for updating credentials!",
};

const access_token_delete_not_allowed = {
  message: "error",
  extraMessage: "Your access_token is not valid for deleting credentials!",
};

const access_token_read_not_allowed = {
  message: "error",
  extraMessage: "Your access_token is not valid for reading credentials!",
};

const permissionChecker = async ({ query, method, url }, res, next) => {
  try {
    const { access_token } = query;
    // Access token not provided...
    if (!access_token) return res.status(403).json(access_token_error);
    const foundUser = await user.findById(access_token);
    // Not found...
    if (!foundUser) return res.status(403).json(access_token_not_found);
    // Create restricting...
    if (method.toUpperCase() === "POST" && !foundUser.permission.create)
      return res.status(403).json(access_token_create_not_allowed);
    // Sign up limit
    // if (url.includes("/sign-up")) {
    //   if (foundUser.create_account_limit >= 20)
    //     return res.status(403).json(access_token_sign_up_over_limited);
    //   await user.findByIdAndUpdate(foundUser._id, {
    //     ...foundUser._doc,
    //     create_account_limit: Number(foundUser.create_account_limit) + 1,
    //   });
    // }

    // Update restricting...
    if (
      (method.toUpperCase() === "PUT" || method.toUpperCase() === "PATCH") &&
      !foundUser.permission.update
    )
      return res.status(403).json(access_token_update_not_allowed);
    // Delete restricting...
    if (method.toUpperCase() === "DELETE" && !foundUser.permission.delete)
      return res.status(403).json(access_token_delete_not_allowed);
    // Read restricting...
    if (method.toUpperCase() === "GET" && !foundUser.permission.read)
      return res.status(403).json(access_token_read_not_allowed);

    return next();
  } catch (error) {
    errorStatus500(error, res);
  }
};

module.exports = permissionChecker;
