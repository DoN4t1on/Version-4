const Joi = require('joi');

const registerSchemaFacebook = Joi.object({
  accessToken: Joi.string().min(20).required(),
});

const registerSchemaGoogle = Joi.object({
  credential: Joi.string().min(20).required(),
});

module.exports = { registerSchemaFacebook, registerSchemaGoogle };
