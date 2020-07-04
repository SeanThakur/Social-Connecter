const validator = require("validator");
const isEmpty = require("./is-empty")

const validatingInputRegister = (data) => {
    let errors = {};

    //In validator isEmpty method take strings
    //1. Converting all Empty input's to string

    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';

    // Validating all the inputs

    //1. name Field validation

    if(!validator.isLength(data.name, {
        min : 2,
        max: 30
    })) {
        errors.name = "Name should be min 2 and max 30 character.";
    }

    if(validator.isEmpty(data.name))
    {
        errors.name = "Name Field required.";
    }

    //2. Email Field Validation

    if(validator.isEmpty(data.name))
    {
        errors.email = "Email Field required."
    }

    if(!validator.isEmail(data.email))
    {
        errors.email = "Email is not proper."
    }

    //3. Password Field Validation

    if(validator.isEmpty(data.password))
    {
        errors.password = "Password Field is required."
    }

    if(validator.isEmpty(data.password2))
    {
        errors.password2 = "Password Field is required."
    }

    if(!validator.equals(data.password, data.password2))
    {
        errors.password2 = "Password not matched.";
    }

    return {
        errors,
        isvalid: isEmpty(errors)
    }
}

module.exports = validatingInputRegister;