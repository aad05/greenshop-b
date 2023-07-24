const jwt = require("jsonwebtoken");
const { errorStatus500, bodyRequirer } = require("../errors");
const { user } = require("../models/userModel");

// SignIn required values...
const sign_in_required_values = ["password", "email"];
const sign_up_required_values = ["name", "surname", "password", "email"];

// Default value
const default_permission = {
  create: false,
  update: false,
  delete: false,
  read: true,
};

// Errors
const userNotFound = {
  message: "error",
  extraMessage: "User not found!",
};

// Method: POST; Description: User sign in
const sign_in = async ({ body }, res) => {
  try {
    const { password, email } = body;

    await bodyRequirer({ body, requiredValue: sign_in_required_values });

    const foundUser = await user.find({ password, email });
    if (!foundUser.length) return res.status(409).json(userNotFound);

    jwt.sign(
      { user: foundUser[0] },
      "09qrjjwef923jnrge$5ndjwk",
      (err, token) => {
        return res.status(200).json({
          message: "success",
          data: {
            token: token,
            user: {
              ...foundUser[0]._doc,
              password: "********",
            },
          },
        });
      }
    );
  } catch (error) {
    return errorStatus500(error, res);
  }
};

const sign_up = async ({ body, query }, res) => {
  try {
    const { isVerify = "" } = query;
    const verified = isVerify === "995321025Aa";

    await bodyRequirer({
      body,
      requiredValue: [
        ...sign_up_required_values,
        verified ? "permission" : "",
      ].filter((value) => value),
    });

    res.status(201).json({
      data: await user.create({
        name: body.name,
        surname: body.surname,
        permission: verified ? body.permission : default_permission,
        password: body.password,
        email: body.email,
        user_type: verified ? "developer" : "observer",
      }),
    });
  } catch (error) {
    errorStatus500(error, res);
  }
};

// Method: POST: Description: User sign in as a chief user
const chief_user_sign_in = async ({ body }, res) => {
  try {
  } catch (error) {
    return errorStatus500(error, res);
  }
};
module.exports = { sign_in, sign_up };
