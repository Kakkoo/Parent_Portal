
const Validator = require("validator");
const isEmpty = require("./is-empty");


module.exports = function validateRegisterInput(data) {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = 'email field is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'email is not valid';
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
