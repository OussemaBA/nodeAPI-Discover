import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const businessSchema = new mongoose.Schema({
  businessName: {
    // business owner's name
    type: String
  },
  address: {
    type: String
  },
  city: { type: String },
  state: { type: String },
  postal_code: {
    type: Number
  },
  reviewsNbr: {
    type: Number,
    default: 0

  },
  revAvg: {
    type: Number,
    default: 1
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  stars: {
    type: Number
  },
  review_count: {
    type: Number
  },
  is_open: {
    typr: Boolean
  },
  attributes: {
    RestaurantsTakeOut: { type: Boolean },
    BusinessParking: {
      garage: { type: Boolean },
      street: { type: Boolean },
      validated: { type: Boolean },
      lot: { type: Boolean },
      valet: { type: Boolean }
    }
  },
  "categories": [],
  "hours": {
    "Monday": {type:Date},
    "Tuesday": {type:Date},
    "Friday": {type:Date},
    "Wednesday": {type:Date} ,
    "Thursday": {type:Date},
    "Sunday": {type:Date},
    "Saturday":{type:Date},
},
photo: {
  data: Buffer,
  contetnType: String
},
businessPhone:{
    type:Number
}	,
webAddress:{
    type:String
},
streetAddress:{
  type:String
},
claimedBy: {
  type: ObjectId,
  ref: "User"
},
zip:{
  type:String
}

});

export default mongoose.model("Business", businessSchema);
