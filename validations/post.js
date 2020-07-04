const validator = require("validator");
const isEmpty = require("./is-empty");

const postValidation = (data) => {
    
    let errors = {};

    data.text = !isEmpty(data.text) ? data.text : '';

    //Validating the text field

    if(validator.isEmpty(data.text))
    {
       errors = "Text field show not be empty";
    }

    //returning the errors and isvalid
    return {
        errors,
        isvalid: isEmpty(errors)
    }
}

module.exports = postValidation;