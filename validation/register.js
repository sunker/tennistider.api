const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password_confirm = !isEmpty(data.password_confirm)
    ? data.password_confirm
    : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Namnet måste ha mellan 2 och 30 tecken";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Namn krävs";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Ogiltig e-postadress";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "E-post krävs";
  }

  if (!Validator.isLength(data.password, { min: 2, max: 30 })) {
    errors.password = "Lösenordet måste ha minst två tecken";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Lösenord krävs";
  }

  if (!Validator.isLength(data.password_confirm, { min: 2, max: 30 })) {
    errors.password_confirm = "Lösenordet måste ha minst två tecken";
  }

  if (!Validator.equals(data.password, data.password_confirm)) {
    errors.password_confirm = "Lösenorden matchar inte";
  }

  if (Validator.isEmpty(data.password_confirm)) {
    errors.password_confirm = "Lösenord krävs";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
