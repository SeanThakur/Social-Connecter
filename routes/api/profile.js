const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Loding profile validation
const profileValidation = require("../../validations/profile");
const experienceValidation = require("../../validations/experience");
const educationValidation = require("../../validations/education");

// Loading modals
const User = require("../../models/User");
const Profile = require("../../models/Profile");

//Routing Links for the profile

//passport autehnciation protected route for fetching the profile info about user just login
router.get("/", passport.authenticate("jwt", {session: false}) , (req,res) => {
    //comparing the user by its token id and populating the name and avatar of the user 
    Profile.findOne({user : req.user.id}).populate("user", ["name", "avatar"]).then(profile => {
        if(!profile)
        {
            res.status(400).json({profile: "There is no profile for this user."});
        }
        //if the profile is there then return the user 
        res.json(profile);
    }).catch(error => {
        res.status(400).json({profile: "There is no profile for this user."});
    });
});

//passport authenticated protected route for posting and editing the profile for the user
router.post("/", passport.authenticate("jwt",{session: false}), (req,res) => {

    // Checking if all the validation is valid or not

    const {errors,isvalid} = profileValidation(req.body);

    if(!isvalid)
    {
        res.status(400).json(errors);
    }

    //Creating objects of profile inputs
    const profileFields = {};

    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    //Skills Checking the comma sepreated value and spliting into arrays

    if(typeof req.body.skills !== "undefined")
    {
        profileFields.skills = req.body.skills.split(",");
    }

    //scoial links

    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube =  req.body.youtube;
    if(req.body.facebook) profileFields.social.facebook =  req.body.facebook;
    if(req.body.instagram) profileFields.social.instagram =  req.body.instagram;
    if(req.body.linkedin) profileFields.social.linkedin =  req.body.linkedin;
    if(req.body.twitter) profileFields.social.twitter =  req.body.twitter;

    //Checking the login user

    Profile.findOne({user: req.user.id}).then(profile => {
        // if there is a profile then updating the profile with inputs else creating the profile
        if(profile) {
            //updating the profile
            Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true}).then(profile => {
                res.json(profile);
            });
        } else {
            //creating the profile

            //Before creating the profile checking if the handle is
            // exists with same name 

            Profile.findOne({handle: profileFields.handle}).then(profile => {
                if(profile) {
                    res.status(400).json({profile: "handle already exists."})
                }
            });

            //Saving the user profile if there is no same handle

            new Profile(profileFields).save().then(profile => {
                res.json(profile);
            }).catch(error => {
                res.status(400).json({profile: "Profile is not been saved."});
            });
        }
    }).catch(error => {
        res.status(400).json({profile: "There is no profile for this user."});
    });
    
});

//Routing the profile get page according to the handle name
router.get("/:handle", (req,res) => {

    //Fetching the handle name 

    Profile.findOne({handle: req.params.handle}).populate("user", ["name", "avatar"]).then(handle => {

        //checking if handle is not exists

        if(!handle)
        {
            res.status(404).json({profile: "There is no profile for this user."});
        }

        res.json(handle);

    }).catch(error => {
        res.status(404).json({profile: "There is no profile for this user."});
    });
});

//Routing the profile get page according to the user id

router.get("/:user_id", (req, res) => {
    //fetching the profile page with user id
    Profile.findOne({user: req.params.user_id}).populate("user", ["name", "avatar"]).then(userProfile => {
        //Checking if the id exists or not
        if(!userProfile)
        {
            res.status(404).json({profile: "There is no profile for this user."});
        }

        res.json(userProfile);

    }).catch(error => {
        res.status(404).json({profile: "There is no profile for this user."});
    });
});

//Fetching all the registered user profile

router.get("/developers", (req,res) => {
    //Fetching all user's profile
    Profile.find().populate("user", ["name", "avatar"]).then(profiles => {
        //checking if profiles are available
        if(!profiles) {
            res.status(404).json({profile: "There is no profiles for this user."});
        }

        res.json(profiles);

    }).catch(error => {
        res.status(404).json({profile: "There is no profiles for this user."});
    });
    
});

//Education and Experience post request routing

router.post("/experience", passport.authenticate("jwt", {session: false}),(req,res) => {

    //checking experience routing is valid or not

    const {errors, isvalid} =  experienceValidation(req.body);

    if(!isvalid) {
        res.status(400).json(errors);
    }

    Profile.findOne({user: req.user.id}).then((experienceProfile) => {

        const newExp = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            discription: req.body.discription
        };

        //Adding the new experience to the profile 

        profile.experience.unshift(newExp);

        profile.save().then(expProfile => {
            res.json(expProfile);
        });

    });
});

router.post("/education", passport.authenticate("jwt", {session: false}), (req,res) => {

    //checking education routing is valid or not

    const {errors, isvalid} =  educationValidation(req.body);

    if(!isvalid) {
        res.status(400).json(errors);
    }

    Profile.findOne({user: req.user.id}).then(educationProfile => {
        const newEdu = {
            school: req.body.school,
            degree: req.body.degree,
            fieldofstudy: req.body.fieldofstudy,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            discription: req.body.discription
        };

        //adding new education to the profile

        profile.education.unshift(newEdu);

        profile.save().then(eduProfile => {
            res.json(eduProfile);
        });

    });
});

//Deleting Expereince and education profile 

router.delete("/experience/:exp_id", passport.authenticate("jwt", {session: false}), (req,res) => {
    //Finding the user that logedin
    Profile.findOne({user: req.user.id}).then(profile => {
        //Mapping the experience with the index id
        const removeExp = profile.experience.map(item = item.id).indexOf(req.params.exp_id);
        //splicing the array of the experience by one
        profile.experience.splice(removeExp, 1);
        //Saving the deleted data
        profile.save().then(profile => {
            res.json(profile);
        }).catch(error => {
            res.json(error);
        });
    });
});

router.delete("/education/:edu_id", passport.authenticate("jwt", {session: false}), (req,res) => {
    //Checking if the user is logedin
    Profile.findOne({user: req.user.id}).then(profile => {
        //Mapping the education profiles according to the index id
        const eduProfile = profile.education.map(item = item.id).indexOf(req.params.edu_id);
        //splicing the education data to its array of profile's educations
        profile.education.splice(eduProfile, 1);
        //Saving the profile deleted data
        profile.save().then(profile => {
            res.json(profile);
        }).catch(error => {
            res.json(error);
        });
    });
});

//Deleting user's Profile and user account 

router.delete("/", passport.authenticate("jwt", {session: false}), (req,res) => {
    //Finding and deleting the logedin user and deleting it's profile 
    Profile.findOneAndRemove({user: req.user.id}).then(() => {
        //finding the deleting the account of the user
        User.findOneAndRemove({_id: req.user.id}).then(() =>{
            res.json({success : "Success in Deleting the profile and user account."})
        });
    });
});


module.exports = router;