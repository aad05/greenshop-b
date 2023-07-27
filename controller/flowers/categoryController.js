const { errorStatus500, bodyRequirer } = require("../../errors");
const { category } = require("../../models/flowers/categoryModel");

const create_post_required_values = ["title"];
const update_post_required_values = ["title", "_id"];
const delete_post_required_values = ["_id"];

// Method: GET; Description: GET categories
const get_categories = async ({}, res) => {
  try {
    return res.status(200).json({
      message: "success",
      data: await category.find(),
    });
  } catch (error) {
    errorStatus500(error, res);
  }
};

// Method: POST; Description: Create category
const post_category = async ({ body, query }, res) => {
  try {
    await bodyRequirer({ body, requiredValue: create_post_required_values });

    res.status(201).json({
      message: "success",
      data: await category.create({
        title: body.title,
        created_by: query.access_token,
        route_path: body.title.toLowerCase().replaceAll(" ", "-"),
      }),
    });
  } catch (error) {
    errorStatus500(error, res);
  }
};

// Method: PUT; Description: Update category
const put_category = async ({ body }, res) => {
  try {
    await bodyRequirer({ body, requiredValue: update_post_required_values });
    await category.findByIdAndUpdate(body._id, { title: body.title });

    return res.status(201).json({
      message: "success",
    });
  } catch (error) {
    errorStatus500(error, res);
  }
};

// Method: DELETE; Description: Delete category
const delete_category = async ({ body }, res) => {
  try {
    await bodyRequirer({ body, requiredValue: delete_post_required_values });
    await category.findByIdAndDelete(body._id);
    return res.status(201).json({ message: "success" });
  } catch (error) {
    errorStatus500(error, res);
  }
};

module.exports = {
  get_categories,
  post_category,
  put_category,
  delete_category,
};
