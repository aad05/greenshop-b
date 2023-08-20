const { errorStatus500, bodyRequirer } = require("../errors");
const { order } = require("../models/placeOrder");

// SignIn required values...
const order_required_values = [
  "shop_list",
  "billing_address",
  "extra_shop_info",
];

// Method: POST; Description: User sign in
const make_order = async ({ body, query }, res) => {
  try {
    await bodyRequirer({ body, requiredValue: order_required_values });

    const { access_token } = query;

    return res.status(201).json({
      message: "success",
      data: await order.create({ ...body, created_by: access_token }),
    });
  } catch (error) {
    return errorStatus500(error, res);
  }
};

module.exports = { make_order };