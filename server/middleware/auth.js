const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authorization = req.get('authorization');
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : authorization;

    if (!token) {
      return res.status(401).json({
        message: "A token is required for authentication",
      });
    }
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      req.user = decoded;
    } catch (err) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }
  } catch {
    return res.status(401).json({
      message: "Unable to authenticate token",
    });
  }

  return next();
};

module.exports = verifyToken;
