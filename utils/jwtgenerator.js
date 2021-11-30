const jwt = require("jsonwebtoken");

function jwtGenerator(user_id) {
  const payload = {
    user: user_id,
  };

  return jwt.sign(payload, "Secret@123");
}

module.exports = jwtGenerator;
