import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "title is required",
    minlength: 3
  },
  body: {
    type: String,
    required: "Body is required",
    minlength: 3,
    maxlength: 2000
  },
  rating: {
    type: Number
  },
  photo: {
    data: Buffer,
    contetnType: String
  },
  postedBy: {
    type: ObjectId,
    ref: "User"
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated:Date,
  likes:[{type:ObjectId,ref:"User"}],
  
  business_id:{
      type:ObjectId,
      ref:"Business"
    }
  
});

export default mongoose.model("Post", postSchema);
