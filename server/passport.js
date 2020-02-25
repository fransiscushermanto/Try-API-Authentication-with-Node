const passport = require("passport"),
  JwtStrategy = require("passport-jwt").Strategy,
  ExtractJWT = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const FacebookTokenStrategy = require("passport-facebook-token");
const {
  JWT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET
} = require("./configuration");
const User = require("./models/user");

//JSON WEB TOKEN
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJWT.fromHeader("authorization"),
      secretOrKey: JWT_SECRET
    },
    async (payload, done) => {
      try {
        //Find the user specified in token
        const user = await User.findById(payload.sub);

        //If user doesn't exist handle it
        if (!user) {
          return done(null, false);
        }

        //Otherwise, return the user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//FACEBOOK OAuth STRATEGY
passport.use(
  "facebookToken",
  new FacebookTokenStrategy(
    {
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("accessToken", accessToken);
        console.log("refreshToken", refreshToken);
        console.log("profile", profile);
        const existingUser = await User.findOne({
          "facebook.id": profile.id
        });

        if (existingUser) {
          console.log("user existed");
          return done(null, existingUser);
        }
        console.log("User is not registered, Registering ...");
        const newUser = new User({
          method: "facebook",
          facebook: {
            id: profile.id,
            email: profile.emails[0].value
          }
        });

        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

//GOOGLE OAuth STRATEGY
passport.use(
  "googleToken",
  new GooglePlusTokenStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("accessToken", accessToken);
        console.log("refreshToken", refreshToken);
        console.log("profile", profile);
        //Check wether this current user exist in our DB
        const existingUser = await User.findOne({
          "google.id": profile.id
        });
        if (existingUser) {
          console.log("user existed");
          return done(null, existingUser);
        }
        console.log("let's register");
        //if new account
        const newUser = new User({
          method: "google",
          google: {
            id: profile.id,
            email: profile.emails[0].value
          }
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

//LOCAL STRATEGY
passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    async (email, password, done) => {
      try {
        //Find the user given the email
        const user = await User.findOne({ "local.email": email });

        //If not, handle it
        if (!user) {
          return done(null, false);
        }

        //Check password
        const isMatch = await user.isValidPassword(password);

        //If not, handle it
        if (!isMatch) {
          return done(null, false);
        }
        //Otherwise, return user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
