const { User } = require('../models');

const checkIsAdmin = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;

    const userInfo = await User.findOne({
      _id: userId,
    });

    if (!userInfo?.isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to use this route",
      });
    }

    return next();
  } catch (err) {
    return res.status(403).json({
      message: "Unable to verify administrator access",
    });
  }
};

module.exports = checkIsAdmin;
