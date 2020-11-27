
import { Router } from "express";

import { forgotPassword, resetPassword } from "../controllers/controller_Password";

// import password reset validator
import {passwordResetValidator}  from "../validator/validator_passwordReset";
const router = Router();

// password forgot and reset routes
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator, resetPassword);

export default router;
