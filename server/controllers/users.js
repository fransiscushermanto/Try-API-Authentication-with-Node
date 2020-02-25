const JWT = require("jsonwebtoken");

const User = require("../models/user");
const { JWT_SECRET } = require("../configuration");

signToken = user => {
  return JWT.sign(
    {
      iss: "fransiscus",
      sub: user.id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1)
    },
    JWT_SECRET
  );
};

module.exports = {
  signUp: async (req, res, next) => {
    const { email, password } = req.value.body;

    const exist = await User.findOne({ "local.email": email });
    if (exist) {
      return res.status(403).send({ error: "Email is already exist" });
    }

    const newUser = new User({
      method: "local",
      local: {
        email: email,
        password: password
      }
    });
    await newUser.save();

    const token = signToken(newUser);

    res.status(200).json({ token });
  },
  signIn: async (req, res, next) => {
    //Generate token
    const token = signToken(req.user);
    res.status(200).json({ token });
    console.log("Logged in");
  },
  googleOAuth: async (req, res, next) => {
    //Generate Token
    console.log("req.user", req.user);
    const token = signToken(req.user);
    res.status(200).json({ token });
  },
  facebookOAuth: async (req, res, next) => {
    console.log("req.user", req.user);
    const token = signToken(req.user);
    res.status(200).json({ token });
  },
  secret: async (req, res, next) => {
    console.log("Welcome");
    res.json({ secret: "resource" });
  },
  tes: async (req, res, next) => {
    res.json(req.value.body);
  }
};
