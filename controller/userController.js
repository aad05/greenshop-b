const jwt = require("jsonwebtoken");
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
const { category } = require("../models/flowers/categoryModel");

// SignIn required values...
const sign_in_required_values = ["password", "email"];
const sign_up_required_values = ["name", "surname", "password", "email"];
const update_account_detials_required_values = [
  "_id",
  "name",
  "surname",
  "email",
  "phone_number",
  "username",
  "profile_photo",
];
const update_address_required_values = [
  "_id",
  "name",
  "surname",
  "country",
  "town",
  "street_address",
  "state",
  "zip",
  "email",
  "phone_number",
];

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
const username_unique = {
  message: "error",
  extraMessage: "username should be unique!",
};
const email_unique = {
  message: "error",
  extraMessage: "email should be unique!",
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

// Method: POST; Description: Update User account details
const update_account_details = async ({ body, query }, res) => {
  try {
    const {
      name = "",
      surname = "",
      email = "",
      phone_number = "",
      username = "",
      profile_photo,
      _id,
    } = body;

    await bodyRequirer({
      body,
      requiredValue: update_account_detials_required_values,
    });

    if (!(await user.find({ username })))
      return res.status(400).json(username_unique);

    await user.findByIdAndUpdate(_id, {
      name,
      surname,
      email,
      phone_number,
      username,
      profile_photo,
    });
    return res.status(201).json({ message: "success" });
  } catch (error) {
    errorStatus500(error, res);
  }
};

// Method: POST; Description: Update User address
const update_address = async ({ body, query }, res) => {
  try {
    const {
      _id,
      name,
      surname,
      country,
      town,
      street_address,
      state,
      zip,
      email,
      phone_number,
      extra_address = "",
    } = body;

    await bodyRequirer({
      body,
      requiredValue: update_address_required_values,
    });

    await user.findByIdAndUpdate(_id, {
      name,
      surname,
      email,
      phone_number,
      billing_address: {
        country,
        town,
        street_address,
        state,
        zip,
        extra_address,
      },
    });
    return res.status(201).json({ message: "success" });
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
    case "small-plants":
      return await small_plants.findById(_id);
    case "big-plants":
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
    console.log(error);
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
      wishlist: foundUser.wishlist.filter(
        (value) => value.flower_id !== body._id
      ),
    });

    return res.status(201).json({
      message: "success",
    });
  } catch (error) {
    return errorStatus500(error, res);
  }
};

// Method: GET; Description: Get product by created_by
const get_products = async ({ query: { access_token } }, res) => {
  try {
    return res.status(200).json({
      message: "success",
      data: [
        ...(await house_plants.find({ created_by: access_token })),
        ...(await potter_plants.find({ created_by: access_token })),
        ...(await seeds.find({ created_by: access_token })),
        ...(await small_plants.find({ created_by: access_token })),
        ...(await big_plants.find({ created_by: access_token })),
        ...(await succulents.find({ created_by: access_token })),
        ...(await trerrariums.find({ created_by: access_token })),
        ...(await gardening.find({ created_by: access_token })),
        ...(await accessories.find({ created_by: access_token })),
      ],
    });
  } catch (error) {
    errorStatus500(error, res);
  }
};

// Method: DELETE; Description: Delete product by created_by
const delete_by_category_and_created_by = async ({ type, _id }) => {
  switch (type) {
    case "house-plants":
      return await house_plants.findByIdAndDelete(_id);
    case "potter-plants":
      return await potter_plants.findByIdAndDelete(_id);
    case "seeds":
      return await seeds.findByIdAndDelete(_id);
    case "small-plants":
      return await small_plants.findByIdAndDelete(_id);
    case "big-plants":
      return await big_plants.findByIdAndDelete(_id);
    case "succulents":
      return await succulents.findByIdAndDelete(_id);
    case "trerrariums":
      return await trerrariums.findByIdAndDelete(_id);
    case "gardening":
      return await gardening.findByIdAndDelete(_id);
    case "accessories":
      return await accessories.findByIdAndDelete(_id);
    default:
      throw new Error("Request should be provided with plant category!");
  }
};
const delete_product = async (
  { query: { access_token }, params, body },
  res
) => {
  try {
    await bodyRequirer({ body, requiredValue: ["_id"] });
    await delete_by_category_and_created_by({
      type: params.category,
      created_by: access_token,
      _id: body._id,
    });
    const foundCategory = await category.find({
      route_path: params.category,
    });

    await category.findByIdAndUpdate(foundCategory[0]._id, {
      count: Number(foundCategory[0].count - 1),
    });

    return res.status(201).json({
      message: "success",
    });
  } catch (error) {
    console.log(error);
    errorStatus500(error, res);
  }
};

// Method: GET; Description: Get user by _id
const get_user = async ({ params }, res) => {
  try {
    await bodyRequirer({ body: params, requiredValue: ["_id"] });
    return res.status(200).json({
      message: "success",
      data: {
        ...(await user.findById(params._id))._doc,
        password: "*******",
        email: "******@gmail.com",
      },
    });
  } catch (error) {
    errorStatus500(error, res);
  }
};

// Method: POST; Description: Follow user
const follow_user = async ({ body, query: { access_token } }, res) => {
  try {
    await bodyRequirer({ body, requiredValue: ["_id"] });

    await user.findByIdAndUpdate(access_token, {
      followers: [...(await user.findById(access_token)).followers, body._id],
    });
    return res.status(201).json({
      message: "success",
    });
  } catch (error) {
    errorStatus500(error, res);
  }
};

const unfollow_user = async ({ body, query: { access_token } }, res) => {
  try {
    await bodyRequirer({ body, requiredValue: ["_id"] });

    await user.findByIdAndUpdate(access_token, {
      followers: (
        await user.findById(access_token)
      ).followers.filter((v) => v !== body._id),
    });

    return res.status(201).json({
      message: "success",
    });
  } catch (error) {
    errorStatus500(error, res);
  }
};

module.exports = {
  sign_in,
  sign_up,
  update_account_details,
  update_address,
  get_wishlist,
  create_wishlist,
  delete_wishlist,
  get_products,
  delete_product,
  get_user,
  follow_user,
  unfollow_user,
};
