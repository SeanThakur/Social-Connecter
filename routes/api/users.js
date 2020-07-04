const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); //Lodong bcryptjs module
const gravatar = require("gravatar"); //Loding gravatar modules
const jwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../../config/config").secretOrKey; //Scret key for jsonwebtoken
const  validatingInputRegister = require("../../validations/register"); //Register validation
const  loginValidation = require("../../validations/login"); //Login Validation

//Loding Models

const User = require("../../models/User");

//Routing Links

router.get("/", (req,res) => {
    res.send("This is an users routing page.")
});

router.post("/register", (req, res) => {

  //Validating Register Fields
  const { isvalid, errors } = validatingInputRegister(req.body);

  if(isvalid === true) { 
    // if errors object is not empty then return errors
    return res.status(400).json(errors);
  }

  User.findOne({email : req.body.email}).then(user => {
    if(user) {
      return res.status(400).json({email : "Email is Already Exists."});
    } 

    const avatar = gravatar.url(req.body.email, {
      s : "200", //size
      r : "pg", //rating
      d : "mm" //default
    });

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      avatar: avatar,
      password : req.body.password
    });
    //Hashing and salting the password using bcryptjs
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err) {
          return err;
        }
        newUser.password = hash;
        newUser.save().then((user) => {
          return res.json(user);
        }).catch((err) => {
          return console.log(err);
        });
      });
    });
  });
});

router.post('/login', (req,res) => {

    //   Checking Validation of Login if is not valid

    const { errors, isValid } =  loginValidation(req.body);

    if(!isValid)
    {
        return res.status(400).json(errors);
    }

    //   if is validation is succeed

   const email = req.body.email;
   const password = req.body.password;
   User.findOne({email: email}).then((user) => {
      if(!user)
      {
          return res.status(400).json({email: "User Not Found."});

      } else {

          bcrypt.compare(password, user.password).then((ismatch) => {
              if (ismatch) {
                  // Password Matched
                  res.json({message: "Login Succeed."});

                  //Implimenting jsonWebToken to the login user
                  const payload = {
                      id : user.id,
                      name : user.name,
                      avatar : user.avatar,
                  }
                  jwt.sign(payload, key, {
                      expiresIn: '3600'
                  }, (err, token) => {
                      res.json({
                          success: true,
                          token: 'Bearer' + token
                      });
                  });

              } else {
                  res.status(400).json({password: "Password not matched."})
              }

          });

      }
   });
});

router.get("/current", passport.authenticate("jwt", {session : false}), (req,res) => {
    res.json({message: "success"});
    res.json(req.user); // user jwt token been saved and extracting after successfull login done
});

//Exporting the router
module.exports = router;
