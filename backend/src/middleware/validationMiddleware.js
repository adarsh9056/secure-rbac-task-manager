const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().map((err) => err.msg);

  return res.status(400).json({
    success: false,
    errors
  });
};

module.exports = validateRequest;
