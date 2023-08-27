const { Schema } = require("mongoose");
const { users_db } = require("../config/db");

const blog_model = new Schema({
  created_at: { type: Date, required: true, default: Date.now },
  created_by: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  short_description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  reaction_length: {
    type: Number,
    default: 0,
  },
});

const blog = users_db.model("blogs", blog_model);

module.exports = { blog };
