const auth = require('./auth.middleware');
const signup = require('./signup.middleware');

module.exports = {
  auth,
  signup,
};
