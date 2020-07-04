const validator = require("validator");
const isEmpty = require("./is-empty");

const experienceValidation = (data) => {

    let errors = {};

    //validating all the experience profile inputs

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    // Checking title , company and from field is empty or not

    if(validator.isEmpty(data.title))
    {
        errors.title = "Title Field is required."
    }

    if(validator.isEmpty(data.company))
    {
        errors.company = "Company Field is required."
    }

    if(validator.isEmpty(data.from))
    {
        errors.from = "From Field is required."
    }

    return {
        errors,
        isvalid: isEmpty(errors)
    }
}

module.exports = experienceValidation;