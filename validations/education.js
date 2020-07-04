const validator = require("validator");
const isEmpty = require("./is-empty");

const educationValidation = (data) => {

    let errors = {};

    //validating all the education profile inputs

    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    // Checking school , degree, fieldofstudy and from field is empty or not

    if(validator.isEmpty(data.school))
    {
        errors.school = "school Field is required."
    }

    if(validator.isEmpty(data.degree))
    {
        errors.degree = "degree Field is required."
    }

    if(validator.isEmpty(data.fieldofstudy))
    {
        errors.fieldofstudy = "Fieldofstudy Field is required."
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

module.exports = educationValidation;