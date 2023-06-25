const User = require("../models/User");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const { request } = require("express");
const JWTStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;
const dotEnv = require("dotenv");
dotEnv.config();

exports.localStrategy = new LocalStrategy(
  { usernameField: "username" }, // optinal but the default is user name
  //Taken username & password from req.body ==> into function
  async (username, password, done) => {
    try {
      //step find the user
      const foundUser = await User.findOne({ username: username });
      if (!foundUser) {
        return done(null, false);
      }
      //check incoming password with the saved password for the user (in the db)
      const passwordMath = await bcrypt.compare(password, foundUser.password);
      if (!passwordMath) {
        return done(null, false);
      }
      //step 3 return the user
      return done(null, foundUser);
    } catch (error) {
      return done(error);
    }
  }
);

exports.JWTStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (tokenpayload, done) => {
    if (Date.now() > tokenpayload.exp * 1000) {
      return done(null, false); // this will throw a 401
    }
    try {
      const user = await User.findById(tokenpayload._id);
      return done(null, user); // if there is no user, this will throw a 401
    } catch (error) {
      return done(error);
    }
  }
);
