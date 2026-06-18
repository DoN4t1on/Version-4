const createHttpError = require('http-errors');
const Validators = require('../validators');

module.exports = function (validator) {
  if (!Validators.hasOwnProperty(validator))
    throw new Error(`'${validator}' validator is not exist`);

  return async function (req, res, next) {
    try {
      const validated = await Validators[validator].validateAsync(req.body);
      req.body = validated;
      next();
    } catch (err) {
      if (err.isJoi)
        return res
          .status(422)
          .json({ status: false, error: err.message, message: err.message });

      next(createHttpError(500));
    }
  };
};
