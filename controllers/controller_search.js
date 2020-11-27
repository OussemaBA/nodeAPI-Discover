import Business from "../models/model_business";

export function getSearchData(req,res,next) {
  if(req.query.category ==='All')
  { Business.find()
  
  .exec((err, biz) => {
    if (err || !biz) {
      return res.send({
        message: "Business Not Found"
      });
    }
    return res.send(biz);
  });}
  else{ Business.find({ categories: req.query.category })
  
  .exec((err, biz) => {
    if (err || !biz) {
      return res.send({
        message: "Business Not Found"
      });
    }
    return res.send(biz);
  });}
 
}
