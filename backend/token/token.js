const jwt = require("jsonwebtoken");

module.exports = {
  generateToken: (data) => {
    return jwt.sign({ data }, process.env.SECRET);
  },
  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.SECRET);
    } catch (err) {
      throw err;
    }
  },
};
