const { Schema } = require("mongoose");
const { users_db } = require("../config/db");

const order_model = new Schema({
  created_at: { type: Date, required: true, default: Date.now },
  created_by: {
    type: String,
    required: true,
  },
  shop_list: {
    type: Array,
    required: true,
    default: [],
  },
  extra_shop_info: {
    type: Object,
    required: true,
  },
  billing_address: {
    type: Object,
    required: true,
  },
});

const order = users_db.model("orders", order_model);

module.exports = { order };
