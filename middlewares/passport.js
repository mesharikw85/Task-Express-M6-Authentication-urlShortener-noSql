const User = require("../models/User");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

exports.localStrategy = new LocalStrategy(
  { usernameField: "username" },
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
