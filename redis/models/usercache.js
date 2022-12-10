const Joi = require("joi");

const usercache = (dynamo) => dynamo.define("usercache", {
  hashKey: "user_id",
  // add the timestamp attributes (updatedAt, createdAt)
  timestamps: true,
  schema: {
    user_id: Joi.string().required(),
    remaining: Joi.number().integer().required(),//.default(180), // should be 180 because after the last update not set to 180 from oAuth service when new user to save
    reset: Joi.number().integer().required(),//.default(0),
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