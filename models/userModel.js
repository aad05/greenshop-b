const { Schema } = require("mongoose");
const { users_db } = require("../config/db");

const user_model = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  permission: {
    type: Object,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  user_type: {
    type: String,
    required: true,
  },
  created_at: { type: Date, required: true, default: Date.now },
  create_post_limit: {
    type: Number,
    required: true,
    default: 0,
  },
  create_account_limit: {
    type: Number,
    required: true,
    default: 0,
  },
  create_plant_limit: {
    type: Number,
    required: true,
    default: 0,
  },
  hashtags: {
    type: Array,
    required: true,
    default: [],
  },
  wishlist: {
    type: Array,
    required: true,
    default: [],
  },
});

const user = users_db.model("users", user_model);

module.exports = { user };
