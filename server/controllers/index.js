const auth = require('./auth.controller');
const email = require('./email.controller');
const post = require('./post.controller');

function controllersFactory() {
  return {
    post,
    email,
    auth,
  };
}

module.exports = controllersFactory;
