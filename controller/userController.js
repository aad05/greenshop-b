const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { errorStatus500, bodyRequirer } = require("../errors");
const { user } = require("../models/userModel");
const {
  house_plants,
  potter_plants,
  seeds,
  small_plants,
  big_plants,
  succulents,
  trerrariums,
  gardening,
  accessories,
} = require("../models/flowers/flowerModel");

// SignIn required values...
const sign_in_required_values = ["password", "email"];
const sign_up_required_values = ["name", "surname", "password", "email"];

// Wishlist required values...
const wishlist_required_values = ["route_path", "flower_id"];

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
const emailExists = {
  message: "error",
  extraMessage:
    "User with same email already exists. Please make sure email is unique amd valid.",
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

// Method: POST; Description: User sign up
const sign_up = async ({ body, query }, res) => {
  try {
    const { isVerify = "", access_token } = query;
    const verified = isVerify === "995321025Aa";

    await bodyRequirer({
      body,
      requiredValue: [
        ...sign_up_required_values,
        verified ? "permission" : "",
      ].filter((value) => value),
    });

    const foundUser = await user.find({ email: body.email });
    if (foundUser.length) return res.status(406).json(emailExists);

    const created_user = await user.create({
      name: body.name,
      surname: body.surname,
      permission: verified ? body.permission : default_permission,
      password: body.password,
      email: body.email,
      user_type: verified ? "developer" : "observer",
      created_by: access_token,
    });

    jwt.sign(
      { user: created_user },
      "09qrjjwef923jnrge$5ndjwk",
      (err, token) => {
        return res.status(201).json({
          message: "success",
          data: {
            token: token,
            user: {
              ...created_user._doc,
              password: "********",
            },
          },
        });
      }
    );
  } catch (error) {
    errorStatus500(error, res);
  }
};

const get_by_id = async ({ type, _id }) => {
  switch (type) {
    case "house-plants":
      return await house_plants.findById(_id);
    case "potter-plants":
      return await potter_plants.findById(_id);
    case "seeds":
      return await seeds.findById(_id);
    case "small_plants":
      return await small_plants.findById(_id);
    case "big_plants":
      return await big_plants.findById(_id);
    case "succulents":
      return await succulents.findById(_id);
    case "trerrariums":
      return await trerrariums.findById(_id);
    case "gardening":
      return await gardening.findById(_id);
    case "accessories":
      return await accessories.findById(_id);
    default:
      throw new Error("Request should be provided with plant category!");
  }
};

// Method: Get: Description: Get wishlist of user
const get_wishlist = async ({ query }, res) => {
  try {
    const { access_token } = query;

    const foundUser = await user.findById(access_token);
    const data = [];
    for await (const value of foundUser.wishlist)
      data.push(
        await get_by_id({
          type: value.route_path,
          _id: value.flower_id,
        })
      );

    return res.status(200).json({
      message: "success",
      data,
    });
  } catch (error) {
    return errorStatus500(error, res);
  }
};

// Method: POST; Description: Add wishlist
const create_wishlist = async ({ body, query: { access_token } }, res) => {
  try {
    await bodyRequirer({ body, requiredValue: wishlist_required_values });
    const foundUser = await user.findById(access_token);
    await user.findByIdAndUpdate(access_token, {
      ...foundUser._doc,
      wishlist: [
        ...foundUser.wishlist,
        {
          route_path: body.route_path,
          flower_id: body.flower_id,
          _id: uuidv4(),
        },
      ],
    });

    return res.status(201).json({
      message: "success",
    });
  } catch (error) {
    return errorStatus500(error, res);
  }
};

// Method: DELETE; Descripition: Delete wished flower
const delete_wishlist = async ({ body, query: { access_token } }, res) => {
  try {
    await bodyRequirer({ body, requiredValue: ["_id"] });
    const foundUser = await user.findById(access_token);
    await user.findByIdAndUpdate(access_token, {
      ...foundUser._doc,
      wishlist: foundUser.wishlist.filter((value) => value._id !== body._id),
    });

    return res.status(201).json({
      message: "success",
    });
  } catch (error) {
    return errorStatus500(error, res);
  }
};

module.exports = {
  sign_in,
  sign_up,
  get_wishlist,
  create_wishlist,
  delete_wishlist,
};
