const express = require("express");
const passport = require("passport");
const router = express.Router();

//Validating Files

const postValidation = require("../../validations/post");
const commentValidation = require("../../validations/comment");

//Load modals
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

//Routing Links for post

//Creating new Post
router.post("/", passport.authenticate("jwt", {session: false}) , (req, res) => {
    //Validation Checking

    const {errors,isvalid} = postValidation(req.body);

    if(!isvalid) {
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar
    });

    newPost.save().then(post => {
        res.json(post);
    }).catch(() => {
        res.status(404).json({post: "post not created."});
    });
});

//Fetching all the post and fetching specific post by its id

router.get("/", (req, res) => {
  //Fetchig all post
  Post.find().then(post => {
      if(post) {
          res.json(post);
      }
      else {
          res.status(404).json({posts: "There is not post added."});
      }
  });
});

router.get("/:id", (req, res) => {
    //Fetching post by its id
    Post.findById(req.params.id).then(post => {
        res.json(post)
    }).catch(() => {
        res.status(404).json({posts: "There is not post."});
    });
});

//Deleting the post by its id

router.delete("/:id", passport.authenticate("jwt", {session: false}) ,(req, res) => {
    //Checking if the user is loged in or not
    Profile.findOne({user: req.user.id}).then(profile => {
        //checking request id is available in post or not
        Post.findById(req.params.id).then(post => {
            //checking the post owner
            if(post.user.toString() !== req.user.id) {
                res.status(404).json({post : "user not authorized."});
            }

            post.remove().then(post => {
                res.json(post);
            }).catch(() => {
                res.status(400).json({post: "post not found."});
            });
        });
    });
});

//Like and unlike routing

router.post("/like/:id",passport.authenticate("jwt", {session: false}) , (req, res) => {
    //checking lokedin user
    Profile.findOne({user: req.user.id}).then(profile => {
        //finding the post by its id
        Post.findById(req.params.id).then(post => {
            //checking if user is already liked the post
            if(post.like.filter(like.user.toString() === req.user.id).length > 0)
            {
                res.status(400).json({liked: "you have already liked this post."});
            }
            // adding like
            post.like.unshift({user: req.user.id});
            post.save().then(likedpost => {
                res.json(likedpost);
            }).catch(error => {
                res.status(400).json({error});
            });
        });
    });
});

router.post("/unlike/:id", passport.authenticate("jwt", {session: false}) ,(req, res) => {
    Profile.findOne({user: req.user.id}).then(profile => {
        Post.findById(req.params.id).then(post => {
            if(post.like.filter(like.user.toString() === req.user.id).length === 0)
            {
                res.status(400).json({unliked: "you have not liked this post."});
            }
            const removelike = post.like.map(item = item.user.id).indexOf(req.user.id);
            post.like.splice(removelike, 1);
            post.save().then(unliked => {
                res.json(unliked);
            });
        });
    });
});

//Adding and removing the comment route

router.post("/comment/:id", passport.authenticate("jwt", {session: false}) ,(req, res) => {
    //Validaation Checking
    const {errors,isvalid} = commentValidation(req.body);

    if(!isvalid) {
        return res.status(400).json(errors);
    }

    //checking if the post is available 
    Post.findById(req.params.id).then(post => {
        //adding comment to the post
        const Addcomment = {
            text: req.body.title,
            name : req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        }

        //Adding comment to the post
        post.comments.unshift(Addcomment);
        //saving the post comment
        post.save().then(postComment => {
            res.json(postComment);
        });
    });
});


router.delete("/comment/:id/:comment_id", passport.authenticate("jwt", {session: false}) ,(req,res) => {
    Profile.findOne({user: req.user.id}).then(() => {
        Post.findById(req.params.id).then(post => {
            //checking if the comment exists or not
            if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0)
            {
                res.status(404).json({comment: "Comment does not exists"});
            }

            const commentPost = post.comments.map(item => item._id).indexOf(req.params.comment_id);

            post.comments.splice(commentPost, 1);

            post.save().then(comment => {
                res.json(comment);
            });
        }); 
    });
});

module.exports = router;