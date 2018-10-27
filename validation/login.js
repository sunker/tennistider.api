const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  let errors = {};
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Felaktig epost';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Epost krävs';
  }

  if (!Validator.isLength(data.password, { min: 2, max: 30 })) {
    errors.password = 'Lösenordet måste vara minst 2 tecken långt';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Lösenord krävs';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
