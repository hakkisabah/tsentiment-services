const dynamo = require("dynamodb");
if (process.env.NODE_ENV === "development") {
  const dotenv = require("dotenv");
  dotenv.config();
}

const credits = {
  region: process.env.SELF_AWS_REGION,
};
dynamo.AWS.config.update(credits);

exports.dynamo = dynamo;
exports.userCache = require("../models/usercache")(dynamo)



