const Joi = require("joi");

const usercache = (dynamo) => dynamo.define("usercache", {
  hashKey: "user_id",
  // add the timestamp attributes (updatedAt, createdAt)
  timestamps: true,
  schema: {
    user_id: Joi.string().required(),
    remaining: Joi.number().required().default(0),
    reset: Joi.number().required().default(0),
    token: Joi.string().default("0"),
    twitterAccessToken: Joi.string().default("0"),
    twitterAccessTokenSecret: Joi.string().default("0"),
    isProcessNow: Joi.boolean().default(false),
  },
  indexes : [
    {hashKey : 'user_id', rangeKey : 'remaining', type: 'global', name : 'RemainingIndex'},
  ]
});

module.exports = usercache;