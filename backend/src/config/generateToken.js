// import jwt from "jsonwebtoken";
const jwt = require("jsonwebtoken");

let generateToken;
generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
