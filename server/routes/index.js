const { Router } = require('express');
const authRoutes = require('./auth.routes');
const emailRoutes = require('./email.routes');
const postRoutes = require('./post.routes');

module.exports = (controllers) => {
  const router = new Router();

  router.use('/email', emailRoutes(controllers.email));
  router.use('/post', postRoutes(controllers.post));
  router.use('/userAuth', authRoutes(controllers.auth));

  return router;
};
