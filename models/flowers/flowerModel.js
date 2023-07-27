const { Schema } = require("mongoose");
const { flowers_db } = require("../../config/db");

const flower_model = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  discount: {
    type: Boolean,
    required: true,
    default: false,
  },
  discount_price: {
    type: String,
    default: "0",
  },
  short_description: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  main_image: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  tags: {
    type: Array,
    default: [],
  },
  comments: {
    type: Array,
    default: [],
  },
  created_at: { type: Date, required: true, default: Date.now },
  created_by: {
    type: String,
    required: true,
  },
});

const house_plants = flowers_db.model("house_plants", flower_model);
const potter_plants = flowers_db.model("potter_plants", flower_model);
const seeds = flowers_db.model("seeds", flower_model);
const small_plants = flowers_db.model("small_plants", flower_model);
const big_plants = flowers_db.model("big_plants", flower_model);
const succulents = flowers_db.model("succulents", flower_model);
const trerrariums = flowers_db.model("trerrariums", flower_model);
const gardening = flowers_db.model("gardening", flower_model);
const accessories = flowers_db.model("accessories", flower_model);

module.exports = {
  house_plants,
  potter_plants,
  seeds,
  small_plants,
  big_plants,
  succulents,
  trerrariums,
  gardening,
  accessories,
};
