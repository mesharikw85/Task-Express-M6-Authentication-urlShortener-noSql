const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signin = async (req, res, next) => {
  try {
    const newUser = await User.findOne(req.user);
    const token = generateToken(newUser);
    res.status(200).json({ token });
  } catch (err) {
    return next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("urls");
    res.status(201).json(users);
  } catch (err) {
    return next(err);
  }
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
const generateToken = (user) => {
  const payload = {
    _id: user._id,
    username: user.username,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token;
};

exports.signup = async (req, res, next) => {
  try {
    req.body.password = await hashPassword(req.body.password);
    const newUser = await User.create(req.body);
    const token = generateToken(newUser);
    res.status(201).json(token);
  } catch (error) {
    return next(error);
  }
};
