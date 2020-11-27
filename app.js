//*******Requirement********/
import express from "express";
import session from "express-session";
const MongoDBStore = require("connect-mongodb-session")(session);
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import { MONGO_URI, JWT_SECRET } from "./config/keys";
dotenv.config();

//***********Passport********/
/*  const GoogleStrategy = require("passport-google-oauth20").Strategy;
  passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientID.googleClientSecret,
      callbackURL: "/auth/google/callback"
    },
    accessToken => {
      console.log(accessToken);
    }
  )
);  */
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
});

const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: "session",
});

//***********Routers*********/
import postRoutes from "./routes/router_post";
import signupRoutes from "./routes/router_sign";
import userRoutes from "./routes/router_user";
import BusinessRoutes from "./routes/router_business";
import SearchRoutes from "./routes/router_search";
import passwordRoutes from "./routes/router_Password";

//*******Middleware*********/
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("tiny"));
app.use(
  session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use("/", userRoutes);
app.use("/", postRoutes);
app.use("/", signupRoutes);
app.use("/", BusinessRoutes);
app.use("/", SearchRoutes);
app.use("/", passwordRoutes);
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

mongoose.connection.on("error", (err) => {
  console.log(`data base connection failed ${err.message}`);
});

//const port = process.env.PORT || 8000;
const port = 8080;

console.log(" port:", port);

app.listen(port, "0.0.0.0");
