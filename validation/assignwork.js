const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateAssignWorkInput(data) {
  let errors = {};

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters.";
  }

  if (isEmpty(data.name)) {
    errors.name = "Name field is required";
  }
  if (isEmpty(data.work)) {
    errors.work = "Work field is required";
  }
 if (isEmpty(data.money)) {
   errors.money = "Money field is required";
 }
 
 
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
