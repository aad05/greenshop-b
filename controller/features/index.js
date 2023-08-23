const { errorStatus500, bodyRequirer } = require("../../errors");
const coupons = require("../../utils/coupon");

// Method: POST; Description: Add email to our daily newsletter
const email_subscription = async ({ body }, res) => {
  try {
    await bodyRequirer({ requiredValue: ["email"], body });

    return res.status(201).json({
      message: "success",
      extraMessage: "Email successfully added to our daily newsletters.",
    });
  } catch (error) {
    errorStatus500(error, res);
  }
};

module.exports = {
  email_subscription,
};
