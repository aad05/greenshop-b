const { errorStatus500, bodyRequirer } = require("../errors");
const { blog } = require("../models/blogModel");

// Method: GET; Description: Get blogs
const get_blog = async ({ query: { search } }, res) => {
  try {
    return res.status(200).json({
      message: "success",
      data: await blog.find({
        $or: [
          {
            title: {
              $regex: `${search}`,
              $options: "i",
            },
          },
        ],
      }),
    });
  } catch (error) {
    errorStatus500(error, res);
  }
};

// Method: POST; Description: Create post
const create_blog = async ({ body, query: { access_token } }, res) => {
  try {
    await bodyRequirer({
      body,
      requiredValue: ["title", "content", "short_description"],
    });
    res.status(201).json({
      message: "success",
      data: await blog.create({ ...body, created_by: access_token }),
    });
  } catch (error) {
    return errorStatus500(error, res);
  }
};

// Method: DELETE; Description: Delete post
const delete_blog = async ({ body, query: { access_token } }, res) => {
  try {
    await bodyRequirer({ body, requiredValue: ["_id"] });
    const foundBlog = await blog.findById(body._id);
    if (foundBlog.created_by !== access_token)
      throw new Error("Your access_token is not valid for this blog!");

    await blog.findByIdAndDelete(foundBlog._id);
    return res.status(201).json({
      message: "success",
    });
  } catch (error) {
    return errorStatus500(error, res);
  }
};

// Method: GET; Desription: Get blog by id
const get_blog_byid = async ({ params }, res) => {
  try {
    await bodyRequirer({ body: params, requiredValue: ["_id"] });
    return res
      .status(200)
      .json({ message: "success", data: await blog.findById(params._id) });
  } catch (error) {
    errorStatus500(error, res);
  }
};

// Method: GET; Description: Get by created_by
const get_blog_by_created_by = async ({ params }, res) => {
  try {
    await bodyRequirer({ body: params, requiredValue: ["_id"] });

    return res.status(200).json({
      message: "success",
      data: await blog.find({ created_by: params._id }),
    });
  } catch (error) {
    errorStatus500(error, res);
  }
};

// Method: PUT; Description: Increase view
const blog_view = async ({ body }, res) => {
  try {
    await bodyRequirer({ body, requiredValue: ["_id"] });
    const foundBlog = await blog.findById(body._id);
    await blog.findByIdAndUpdate(body._id, {
      views: Number(foundBlog.views) + 1,
    });
    return res.status(201).json({ message: "success" });
  } catch (error) {
    errorStatus500(error, res);
  }
};

module.exports = {
  get_blog,
  create_blog,
  delete_blog,
  get_blog_byid,
  get_blog_by_created_by,
  blog_view,
};
