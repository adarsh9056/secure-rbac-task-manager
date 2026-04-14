const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().map((err) => ({
    field: err.path,
    message: err.msg
  }));

  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors
  });
};

module.exports = validateRequest;
