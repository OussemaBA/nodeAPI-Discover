import Joi from 'joi';

function postValidator(req, res, next) {


    const title_schema = Joi.object().keys({
        title: Joi.string().min(3).max(200).required()
    });
    const title_res = Joi.validate({
        title: req.body.title
    }, title_schema);
    

    if (!(title_res.error == null)) {
     return    res.status(400).send("Title Error !");
    }


    const body_schema = Joi.object().keys({
        body: Joi.string().min(3).required()
    });
    const body_res = Joi.validate({
        body: req.body.body
    }, body_schema);

    console.log(body_res.error)

    if (!(body_res.error == null)) {
      return   res.status(400).send("Body Error !");
    }

    next();

};






export default postValidator;