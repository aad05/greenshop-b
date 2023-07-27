const { Schema } = require("mongoose");
const { flowers_db } = require("../../config/db");

const category_model = new Schema({
  title: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
    default: 0,
  },
  route_path: {
    type: String,
  },
  created_at: { type: Date, required: true, default: Date.now },
  created_by: {
    type: String,
    required: true,
  },
});

const category = flowers_db.model("category", category_model);

module.exports = { category };
