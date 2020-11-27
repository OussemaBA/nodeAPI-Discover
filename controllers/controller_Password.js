
import User from "../models/model_user"
import jwt from "jsonwebtoken";

const _ = require("lodash");
const { sendEmail } = require("../helpers");
// load env
const dotenv = require("dotenv");
dotenv.config();

export function forgotPassword(req, res) {
  console.log("req ", req.body);

  if (!req.body) return res.send({ error: "No request body" ,message:null});
  if (!req.body.email)
    return res.send({ error: "No Email in request body",message:null });

  console.log("forgot password finding user with that email");
  const { email } = req.body;
  console.log("signin req.body", email);
  // find the user based on email
  
  User.findOne({ email }, (err, user) => {
    // if err or no user
    if (err || !user)
      return res.send({
        error: "User with that email does not exist!",message:null
      });

    // generate a token with user id and secret
    const token = jwt.sign(
      { _id: user._id, iss: "NODEAPI" },
      process.env.JWT_SECRET
    );

    // email data
    const emailData = {
      from: "noreply@node-react.com",
      to: email,
      subject: "Password Reset Instructions",
      text: `Please use the following link to reset your password: ${
        process.env.CLIENT_URL
      }/reset-password/${token}`,
      html: `<p>Please use the following link to reset your password:</p> <p>${
        process.env.CLIENT_URL
      }/reset-password/${token}</p>`
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.send({ message: err,error:null });
      } else {
        sendEmail(emailData);
        return res.send({
          message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
          error:null
        });
      }
    });
  });
}

export async function resetPassword(req, res) {
  const { resetPasswordLink, newPassword } = req.body;
  
  let user = await User.findOne({ resetPasswordLink });
  if (!user) {
    return res.send({
      error: "Invalid Link!",message:null    });
  }

  

    const updatedFields = {
      password: newPassword,
      resetPasswordLink: ""
    };

    user = _.extend(user, updatedFields);
    user.updated = Date.now();

    user.save((err, result) => {
      if (err) {
        return res.send({
          error: err
        });
      }
      res.send({
        message: `Great! Now you can login with your new password.`
      });
    });
  }


