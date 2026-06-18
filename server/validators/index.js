const {
  registerSchemaFacebook,
  registerSchemaGoogle,
} = require('./social_register.validator');
const registerSchemaEmail = require('./email_register.validator');

const loginSchemaEmail = require('./email_login.validator');

module.exports = {
  registerSchemaFacebook,
  registerSchemaGoogle,
  registerSchemaEmail,
  loginSchemaEmail,
};
