import User from "../models/model_user";
import _ from "lodash";
import Post from "../models/model_post";
var fs = require("fs");
var multer = require("multer");

/////////////////////////////////////////
/////////////FILE STORAGE///////////////
///////NO-VALIDATION-IMPLEMENTED///////
//////////////////////////////////////

//***mullter*****///SET STORAGE
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/");
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  }
});

export function userbyId(req, res, next, id) {
  User.findById(id)
    .populate("following", "_id name")
    .populate("followers", "_id name")

    .exec((err, user) => {
      if (err || !user) {
        return res.send({
          message: "User Not Found"
        });
      }
      req.profile = user;

      return next();
    });
}

export function hasAuthorization(req, res, next) {
  /* console.log("req.user._id: ", req.body.user._id);
  console.log("req.auth._id: ", req.body.auth._id);
  console.log("req.isLoggedIn : ", req.body.isLoggedIn);
 */
  const authorized =
    req.body.isLoggedIn && req.body.user._id === req.body.auth._id;

  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized to perform this action"
    });
  }
  return next();
}

export function showAllUsers(req, res) {
  User.find((err, users) => {
    if (err) {
      return res.send({
        message: err
      });
    }
    return res.send({
      users
    });
  });
}

export function getUser(req, res) {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;

  return res.send(req.profile);
}

export function updateUserInfo(req, res, next) {
  let user = req.body;

  user = _.extend(req.profile, user);

  user.update = Date.now();

  user.save(err => {
    if (err) {
      res.send({
        message: "You don't have permission"
      });
    } else
      return res.send({
        message: "success"
      });
  });
}

//*******AVATAR HANDLER********* */
export function updateUserPhoto(req, res, next) {
  var upload = multer({ storage: storage }).single("file");

  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.send({ message: "file failed to upload" });
    } else if (err) {
      return res.send({ message: "file failed to upload" });
    }

    let user = req.profile;

    user.photo.data = fs.readFileSync(req.file.path);
    user.photo.contentType = req.file.mimetype;

    user.save(err => {
      if (err) {
        res.send({
          message: "You don't have permission"
        });
      } else
        return res.send({
          message: "success"
        });
    });
  });
}

export function deleteUser(req, res, next) {
  let user = req.profile;
  user.remove((err, user) => {
    if (err) {
      return res.send({
        message: err
      });
    }
    return res.send({
      message: "User deleted Successfully"
    });
  });
}

export function postedByUser(req, res, next) {
  Post.find({ postedBy: req.profile._id })
    .populate("PostedBy", "_id name")
    .sort("created")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }

      return res.send(posts );
    });
}

export function getUserPhoto(req, res, next) {

  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);

    return res.send(req.profile.photo.data);
  }
}

export function addFollowing(req, res, next) {
  User.findByIdAndUpdate(
    req.body.userId,
    { $push: { following: req.body.followId } },
    (err, resultat) => {
      if (err) {
        return res.send({ message: "error while following this user" });
      }
      next();
    }
  );
}

export function addFollower(req, res, next) {

  User.findByIdAndUpdate(
    req.body.followId,
    { $push: { followers: req.body.userId } },
    { new: true }
  )
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, result) => {

      if (err) {
        return res.send({
          message: "error follower"
        });
      }
      

      result.hashed_password = undefined;
      result.salt = undefined;
      res.send(
        result 
      );  
    }); 
}

export function removeFollowing(req, res, next) {
  User.findByIdAndUpdate(
    req.body.userId,
    { $pull: { following: req.body.unfollowId } },
    (err, res) => {
      if (err) {
        return res.send({ message: "error while following this user" });
      }
      next();
    }
  );
}

export function removeFollower(req, res, next) {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    { $pull: { followers: req.body.userId } },
    { new: true }
  )
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.send({
          message: "error follower"
        });
      }
      result.hashed_password = undefined;
      result.salt = undefined;
      return res.send(
         result
      ); 
    });
}

export function findPeople(req,res){
  let following =req.profile.following; 
  following.push(req.profile._id);
  User.find({_id:{$nin:following}},(err,users)=>{
      if(err){
        return res.send({message:"err"});
      }
      return res.send({
        users
      });
      }).select('name');

}