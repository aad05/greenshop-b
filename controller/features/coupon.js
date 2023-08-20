const { errorStatus500, bodyRequirer } = require("../../errors");
const coupons = require("../../utils/coupon");

// Method: GET; Description: GET flower discount
const get_coupon_discount = async ({ query }, res) => {
  try {
    await bodyRequirer({ requiredValue: ["coupon_code"], body: query });
    const foundData = coupons.find((value) => value.code === query.coupon_code);
    if (!foundData)
      return res
        .status(400)
        .json({ message: "error", extraMessage: "Can not find coupon code!" });

    return res.status(200).json({
      message: "success",
      data: coupons.find((value) => value.code === query.coupon_code),
    });
  } catch (error) {
    errorStatus500(error, res);
  }
};

module.exports = {
  get_coupon_discount,
};
