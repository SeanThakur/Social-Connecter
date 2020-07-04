const validator = require("validator");
const isEmpty = require("./is-empty")

const loginValidation = (data) => {

    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    //validation for the login inputs

    //1. Email Validation

    if(validator.isEmpty(data.email))
    {
        errors.email = "Email Field is required.";
    }

    if(!validator.isEmail(data.email))
    {
        errors.email = "Email is invalid.";
    }

    //2. Password Validation

    if(validator.isEmpty(data.password))
    {
        errors.password = "password Field is required.";
    }

    return {
        errors,
        isValid : isEmpty(errors)
    }

}

module.exports = loginValidation;