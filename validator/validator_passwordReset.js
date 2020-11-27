import Joi from '@hapi/joi';
import PasswordComplexity from 'joi-password-complexity';

export function passwordResetValidator(req, res, next) {
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

    next();
}