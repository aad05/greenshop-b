const { Schema } = require("mongoose");
const { users_db } = require("../config/db");

const notification_model = new Schema({
  created_at: { type: Date, required: true, default: Date.now },
  belongs_to: {
    type: String,
    required: true,
  },
  notification_stack: {
    type: Array,
    required: true,
    default: [],
  },
});

const notification = users_db.model("notifications", notification_model);

module.exports = { notification };
