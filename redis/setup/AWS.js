const AWS = require("aws-sdk");
if (process.env.NODE_ENV === "development") {
  const dotenv = require("dotenv");
  dotenv.config();
}

const credits = {
  credentials:{
    accessKeyId: process.env.SELF_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SELF_AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.SELF_AWS_REGION,
};

exports.credits = credits;

AWS.config.update(credits);
exports.AWS = AWS;
