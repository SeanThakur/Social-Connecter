const validator = require("validator");
const isEmpty = require("./is-empty");

const profileValidation = (data) => {

    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : "";
    data.status = !isEmpty(data.status) ? data.status : "";
    data.skills = !isEmpty(data.skills) ? data.skills : "";

    //Validating the profile Inputs

    //1. handle Validation

    if(validator.isEmpty(data.handle))
    {
        errors.handle = "This field is required.";
    }

    //2. status validation

    if(validator.isEmpty(data.status))
    {
        errors.status = "This field is required.";
    }

    //3. skills validation

    if(validator.isEmpty(data.skills))
    {
        errors.skills = "This field is required.";
    }

    //4. social links and website validation

    if(!validator.isEmpty(data.website))
    {
        if(!validator.isURL(data.website))
        {
            errors.website = "Not valid url";
        }
    }

    if(!validator.isEmpty(data.youtube))
    {
        if(!validator.isURL(data.youtbe))
        {
            errors.website = "Not valid url";
        }
    }

    if(!validator.isEmpty(data.facebook))
    {
        if(!validator.isURL(data.facebook))
        {
            errors.website = "Not valid url";
        }
    }

    if(!validator.isEmpty(data.instagram))
    {
        if(!validator.isURL(data.instagram))
        {
            errors.website = "Not valid url";
        }
    }

    if(!validator.isEmpty(data.twitter))
    {
        if(!validator.isURL(data.twitter))
        {
            errors.website = "Not valid url";
        }
    }

    if(!validator.isEmpty(data.linkedin))
    {
        if(!validator.isURL(data.linkedin))
        {
            errors.website = "Not valid url";
        }
    }

    //returning the errors and isvalid

    return {
        errors,
        isvalid: isEmpty(errors)
    }

}

module.exports = profileValidation;