import Post from "../models/model_post";
import fs from "fs";
import _ from "lodash";
import Business from "../models/model_business";

var multer = require("multer");

export function getPosts(req, res) {
   Post.find({})
    .populate("postedBy", "_id name")
    .populate("business_id")

    .sort({ created: "desc" })
    .then(posts => {
      res.send({
        posts: posts
      });
    });
}

export async function createPost(req, res, next) {
  console.log("req.body",req.body)
  Business.findById(req.body.business_id)
  .exec((err, biz) => {
    if (err || !biz) {
      return res.send({
        error: err
      });
    }
   console.log(" before biz",biz)
    biz.revAvg= ((biz.reviewsNbr*biz.revAvg)+req.body.rating)/(biz.reviewsNbr+1)
    biz.reviewsNbr+=1;
    console.log(" after biz",biz)

      biz.save(err => {
    if (err) {
      return res.send({
        message: "You don't have permission"
      });
    } else
      return res.send({
        message: "success"
      });
  });
 


});

 
  const post = await new Post(req.body);
  await post.save()
  
}

export function postById(req, res, next, id) {
  Post.findById(id)
    .populate("postedBy", "_id name")
    .exec((err, post) => {
      if (err || !post) {
        return res.send({
          error: err
        });
      }
      req.post = post;
      next();
    });
}

export function isPoster(req, res, next) {
  let isPoster = req.post.postedBy._id === req.post.postedBy._id;


  if (!isPoster) {
    return res.status(403).json({
      error: "Forbidden"
    });
  }
  return next();
}

export function deletePost(req, res) {
  let post = req.post;

  post.remove((err, post) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }

    res.json({
      message: "post deleted succesfully"
    });
  });
}

export function updatePost(req, res, next) {
  let post = req.post;
  
  post = _.extend(post, req.body);
  post.updatePost = Date.now();

  post.save(err => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    res.status(200).json({ post });
  });
}

export function getPostPhoto(req, res, next) {
  if (req.post.photo.data) {
    res.set("Content-Type", req.post.photo.contentType);

    return res.send(req.post.photo.data);
  }
}

export function viewPost(req, res) {
  const post =req.post
  return res.send(post);
}

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

export function updatePostPhoto(req, res, next) {
  var upload = multer({ storage: storage }).single("file");

  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.send({ message: "file failed to upload" });
    } else if (err) {
      return res.send({ message: "file failed to upload" });
    }

    let post = req.post;
    
    post.photo.data = fs.readFileSync(req.file.path);
    post.photo.contentType = req.file.mimetype;
      
    post.save(err => {
      if (err) {
        res.send({
          message: "You don't have permission"
        });
      } else{
        return res.send({
          message: "success"
        }
        );
      }
    });
  });
}



export function like(req,res){

Post.findByIdAndUpdate(req.body.postId,
  {$push:{likes:req.body.userId}},
  {new:true}).exec((err,result)=>{
      if(err)
      return res.send({"message ":err})
      else
      return res.send(result)
  })
}


export function unlike(req,res){
  Post.findByIdAndUpdate(req.body.postId,
    {$pull:{likes:req.body.userId}},
    {new:true}).exec((err,result)=>{
        if(err)
        return res.send({"message ":err})
        else
        return res.send(result)
    })
  }


  export function postsByCategory(req,res){
      Post.find({label:req.body.label},(err,docs)=>{
            if(err) {
            return    res.send({message:err})
            }
            return res.send(docs)
      });


  }