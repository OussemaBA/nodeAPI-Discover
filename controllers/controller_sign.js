import User from "../models/model_user";
import jwt from "jsonwebtoken";

export async function signUp(req, res) {
  const userExist = await User.findOne({
    email: req.body.email
  });
  if (userExist) {
    return res.send({
      message: "Email already exist"
    });
  }
  const user = await new User(req.body);
  await user.save();

  return res.send({
    message: "success"
  });
}

export function requriedSignIn(req, res, next) {
  const bearerHeader = req.headers.authorization;

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ")[1];

    jwt.verify(bearer, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        return res.send({
          message: "User is not Authorized to perform this action"
        });
      }
      req.user = data;
      return next();
    });
  } else {
    return res.send({
      message: "User is required to Sign in"
    });
  }
}
//***********Sign Out*********/
export function signOut(req, res) {
  req.session.destroy(err => {
    if (err)
      return res.send({
        message: "Session Error"
      });
    //you have to redirect the user  !!
  });

  res.clearCookie("t");
  return res.send({
    message: "Sign Out Success !"
  });
}

export function signIn(req, res) {
  const { email, password } = req.body;

  User.findOne(
    {
      email
    },
    (err, user) => {
      if (err || !user) {
        return res.send({
          message: "a user With that email does not exist."
        });
      }

      if (!user.authenticate(password)) {
        return res.send({
          message: "Email and Password does not match "
        });
      }

      const token = jwt.sign(
        {
          _id: user._id
        },
        process.env.JWT_SECRET
      );

      res.cookie("t", token, {
        expiresIn: "3d"
      });
      const { _id, name, email } = user;
      return res.send({
        token,
        user: {
          _id,
          email,
          name
        },
        message: "success"
      });
    }
  ).then(user => {
    req.session.loggedUserid = user._id;
    req.session.isLoggedIn = true;
    req.session.save(err => {
      //redirect HERE!!!!!!
    });
  });
}

export async function socialLogin(req, res) {
  // try signup by finding user with req.email

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    // create a new user and login
    user = new User(req.body);
    req.profile = user;
    user.save();
    // generate a token with user id and secret
    const token = jwt.sign(
      { _id: user._id, iss: "NODEAPI" },
      process.env.JWT_SECRET
    );
    res.cookie("t", token, { expire: new Date() + 9999 });
    // return response with user and token to frontend client
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, name, email } });
  } else {
    // update existing user with new social info and login
    req.profile = user;
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.save();
    // generate a token with user id and secret
    const token = jwt.sign(
      { _id: user._id, iss: "NODEAPI" },
      process.env.JWT_SECRET
    );
    res.cookie("t", token, { expire: new Date() + 9999 });
    // return response with user and token to frontend client
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, name, email } });
  }
}
