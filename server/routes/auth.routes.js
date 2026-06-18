const { Router } = require('express');
const auth = require('../middleware/auth');
const Validator = require('../middleware/validate');
const upload = require('../middleware/upload');
module.exports = (userAuthController) => {
  const userAuthRouter = new Router();

  userAuthRouter.post(
    '/registerByFb',
    Validator('registerSchemaFacebook'),
    userAuthController.registerByFb
  );
  userAuthRouter.post(
    '/registerByGoogle',
    Validator('registerSchemaGoogle'),
    userAuthController.registerByGoogle
  );

  userAuthRouter.post(
    '/registerByEmail',
    Validator('registerSchemaEmail'),
    userAuthController.registerByEmail
  );
  userAuthRouter.post(
    '/checkemail',

    userAuthController.CheckEmailOrUsername
  );

  userAuthRouter.post(
    '/loginByEmail',
    Validator('loginSchemaEmail'),
    userAuthController.login
  );

  userAuthRouter.get(
    '/forgetpassverify/uniqueid/:uniqueId',
    userAuthController.forgetPasswordVerify
  );

  userAuthRouter.post(
    '/updateuserinfo',
    auth,
    upload.array('pics'),
    userAuthController.updateUserInfo
  );

  userAuthRouter.get(
    '/getSingleUserDetail/:userId',
    userAuthController.getSingleUserDetail
  );

  userAuthRouter.post('/updatepassword', userAuthController.updateUserPassword);

  return userAuthRouter;
};
