import Joi from '@hapi/joi';
import PasswordComplexity from 'joi-password-complexity';


function singUpValidator(req, res, next) {



    //**************PASSWORD VALIDATION*****************/
    const complexityOptions = {
        min: 1,
        max: 30,
        lowerCase: 1,
        upperCase: 1,
        numeric: 0,
        symbol: 1,
        requirementCount: 3,
    }

    const password_res = Joi.validate(req.body.password, new PasswordComplexity(complexityOptions));

            
    if (!(password_res.error== null)) {
        return res.send({
            message: "Password  does not meet the minimun requirement"}); 
    }






    //**************SignUpValidation*****************/
    const name_schema = Joi.object().keys({
        first: Joi.string().min(3).max(15).required(),

        middle: Joi.string().min(3).max(15).required(),

        last: Joi.string().min(3).max(15).required()
    });

    const {first,middle,last}=req.body.name;
 
    const name_res=Joi.validate({
        middle: middle,
        first:first,
        last: last,
    }, name_schema);

    const email_schema = Joi.object().keys({
        email: Joi.string().email({
            minDomainSegments: 2
        }),
    });
     const email_res = Joi.validate({
        email:req.body.email
    }, email_schema);

    if (!(name_res.error === null)) {
        return  res.send({
            message: "first middle last field are required and their length must be between 3 and 15!"
        })
        ;
    }


  
    
    if (!(email_res.error== null)) {
        return res.send({
            message: "Email is not valide"}); 
    }

   

   

    next();
}
export default singUpValidator;