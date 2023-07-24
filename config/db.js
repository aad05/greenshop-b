const mongoose = require("mongoose");

const users_db = mongoose.createConnection(
  "mongodb+srv://greenshopaema:3K5zDqDFHpu56QLA@greenshop.dvvqnvq.mongodb.net/users?retryWrites=true&w=majority"
);

module.exports = {
  users_db,
};
