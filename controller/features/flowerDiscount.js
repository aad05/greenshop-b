const { errorStatus500 } = require("../../errors");
const flower_discount = require("../../utils/flower_discount");

// Method: GET; Description: GET flower discount
const get_discount_flower = async ({}, res) => {
  try {
    return res.status(200).json({
      message: "success",
      data: flower_discount[Math.floor(Math.random() * 5)],
    });
  } catch (error) {
    errorStatus500(error, res);
  }
};

module.exports = {
  get_discount_flower,
};
