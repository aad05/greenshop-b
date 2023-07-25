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

const permissionChecker = async ({ query, method }, res, next) => {
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
