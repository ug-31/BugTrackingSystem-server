const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");

    if (!jwtToken) {
      return res.status(403).json("Not Authorize 1");
    }

    const payload = jwt.verify(jwtToken, "Secret@123");

    req.user = payload.user;

    next();
  } catch (error) {
    console.error(error.message);
    res.status(403).json("Not Authorize 2");
  }
};
