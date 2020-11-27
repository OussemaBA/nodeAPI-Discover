import Business from "../models/model_business";
import fs from "fs";
import Post from "../models/model_post";
var multer = require("multer");


export async function PostBusinessPage(req, res, next) {
  const biz = await new Business(req.body);
  await biz.save();
  return res.send(biz);
}

export function getBusinessPages(req, res, next) {
  Business.find({})
    .populate("claimedBy", "_id name email")
    .then(bizs => {
      res.send({
        bizs: bizs
      });
    });
}

export function PostsByBizId(req, res, next, id) {
  
  Post.find({ business_id: { $in: id } })
  .exec((err, biz) => {
    if (err || !biz) {
      return res.send({
        message: "Business Not Found"
      });
    }
    req.biz = biz;
     next();
  });
}

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/");
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  }
});

export function updateBizPhoto(req, res, next) {
  var upload = multer({ storage: storage }).single("file");

  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.send({ message: "file failed to upload" });
    } else if (err) {
      return res.send({ message: "file failed to upload" });
    }

    let biz = req.biz;
    console.log(biz);

    biz.photo.data = fs.readFileSync(req.file.path);
    biz.photo.contentType = req.file.mimetype;
      
    biz.save(err => {
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

export function bizById(req, res, next, id) {
  Business.findById(id)
    .exec((err, biz) => {
      if (err || !biz) {
        return res.send({
          error: err
        });
      }
      req.biz = biz;
      next();
    });
}

export function getBizphoto(req, res, next) {
  if (req.biz.photo.data) {
    res.set("Content-Type", req.biz.photo.contentType);

    return res.send(req.biz.photo.data);
  }
}