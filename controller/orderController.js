const { errorStatus500, bodyRequirer } = require("../errors");
const { order } = require("../models/placeOrder");

// Required values...
const order_required_values = [
  "shop_list",
  "billing_address",
  "extra_shop_info",
];

// Method: POST; Description: Make order
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

// Method: GET; Description: Get order made by smn
const get_order = async ({ query }, res) => {
  try {
    const { access_token } = query;
    return res.status(201).json({
      message: "success",
      data: await order.find({ created_by: access_token }),
    });
  } catch (error) {
    return errorStatus500(error, res);
  }
};

// Method: DELETE; Description: Delete track order
const delete_order = async ({ body }, res) => {
  try {
    await bodyRequirer({ body, requiredValue: ["_id"] });
    await order.findByIdAndDelete(body._id);
    return res.status(201).json({
      message: "success",
    });
  } catch (error) {
    errorStatus500(error, res);
  }
};

module.exports = { make_order, get_order, delete_order };
