const { errorStatus500, bodyRequirer } = require("../../errors");
const {
  house_plants,
  potter_plants,
  seeds,
  small_plants,
  big_plants,
  succulents,
  trerrariums,
  gardening,
  accessories,
} = require("../../models/flowers/flowerModel");
const { category } = require("../../models/flowers/categoryModel");

// Required values
const post_required_value = [
  "title",
  "price",
  "short_description",
  "description",
  "main_image",
  "detailed_images",
];

// Helpers
const get_by_category_checker = async ({
  type,
  category_type,
  sort,
  range_min,
  range_max,
}) => {
  const sort_checker = () => {
    switch (sort) {
      case "default-sorting":
        return 0;
      case "the-cheapest":
        return 1;
      case "most-expensive":
        return -1;
      default:
        0;
    }
  };
  const category_type_checker = () => {
    switch (category_type) {
      case "new-arrivals":
        return 1;
      case "all-plants":
        return 0;
      default:
        return 0;
    }
  };

  const sold_checker = () => {
    switch (category_type) {
      case "sale":
        return -1;
      default:
        return 0;
    }
  };

  const field_apply = async (model) => {
    return await model
      .find({ price: { $lte: range_max, $gte: range_min } })
      .sort({
        price: sort_checker(),
        created_at: category_type_checker(),
        sold_times: sold_checker(),
      });
  };

  switch (type) {
    case "house-plants":
      return await field_apply(house_plants);
    case "potter-plants":
      return await field_apply(potter_plants);
    case "seeds":
      return await field_apply(seeds);
    case "small_plants":
      return await field_apply(small_plants);
    case "big_plants":
      return await field_apply(big_plants);
    case "succulents":
      return await field_apply(succulents);
    case "trerrariums":
      return await field_apply(trerrariums);
    case "gardening":
      return await field_apply(gardening);
    case "accessories":
      return await field_apply(accessories);
    default:
      throw new Error("Request should be provided with plant category!");
  }
};

const post_by_category_checker = async ({ type, body }) => {
  const updater_by_category = async (model) => {
    try {
      const foundData = await category.find({ route_path: type });
      await category.findByIdAndUpdate(foundData[0]._id, {
        ...foundData[0]._doc,
        count: foundData[0].count + 1,
      });
      return await model.create(body);
    } catch (error) {
      throw new Error(error);
    }
  };

  switch (type) {
    case "house-plants":
      return await updater_by_category(house_plants);
    case "potter-plants":
      return await updater_by_category(potter_plants);
    case "seeds":
      return await updater_by_category(seeds);
    case "small_plants":
      return await updater_by_category(small_plants);
    case "big_plants":
      return await updater_by_category(big_plants);
    case "succulents":
      return await updater_by_category(succulents);
    case "trerrariums":
      return await updater_by_category(trerrariums);
    case "gardening":
      return await updater_by_category(gardening);
    case "accessories":
      return await updater_by_category(accessories);
    default:
      throw new Error("Request should be provided with plant category!");
  }
};

// Method: GET; Description: Get flowers by category
const get_by_category = async ({ params, query }, res) => {
  try {
    const { category } = params;
    const {
      type = "all-plants",
      sort = "default-sorting",
      range_min = 0,
      range_max = 1000,
    } = query;

    res.status(200).json({
      message: "success",
      data: await get_by_category_checker({
        type: category,
        category_type: type,
        sort,
        range_min,
        range_max,
      }),
    });
  } catch (error) {
    errorStatus500(error, res);
  }
};

// Method: POST; Description: Create flowers by category
const post_by_category = async ({ body, params, query }, res) => {
  try {
    const { category } = params;
    const { access_token } = query;
    await bodyRequirer({ body, requiredValue: post_required_value });

    res.status(201).json({
      message: "sucess",
      data: await post_by_category_checker({
        type: category,
        body: { ...body, created_by: access_token },
      }),
    });
  } catch (error) {
    errorStatus500(error, res);
  }
};

// Method: PUT; Description: Update flower by category
const put_by_category = async () => {};

// Method: DELETE; Description: Delete flower by category
const delete_by_category = async () => {};

module.exports = {
  get_by_category,
  post_by_category,
  put_by_category,
  delete_by_category,
};
