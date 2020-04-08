"use strict";
const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const userModel = require("../models/userModel");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require("bcrypt");

// local strategy for username password login
passport.use(
  new Strategy(async (username, password, done) => {
    try {
      console.log(username, password);
      const user = await userModel.find({ email: username });
      if (user === undefined) {
        return done(null, false, { message: "Incorrect email." });
      }
      if (!(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: "Incorrect password." });
      }
      const strippedUser = {
        _id: user._id,
        email: user.email,
        full_name: user.full_name,
      };
      delete user.password;
      console.log(strippedUser);
      return done(null, { ...strippedUser }, { message: "Logged In Successfully" }); // use spread syntax to create shallow copy to get rid of binary row type
    } catch (err) {
      return done(err);
    }
  })
);

// TODO: JWT strategy for handling bearer token
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "asd123",
    },
    async (jwtPayload, done) => {
      console.log("payload", jwtPayload);
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      try {
        const user = await userModel.findById(jwtPayload._id);
        delete user.password;
        console.log("pl user", user);
        const strippedUser = {
          _id: user._id,
          email: user.email,
          full_name: user.full_name,
        };
        return done(null, strippedUser);
      } catch (e) {
        return done(null, false);
      }
    }
  )
);

module.exports = passport;
