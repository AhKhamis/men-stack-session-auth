const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

const signup = (req, res) => {
  res.render("auth/sign-up.ejs");
};

const register = async (req, res) => {
  try {

    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.status(400).send("Invalid input");
    }


    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).send("Invalid input");
    }


    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    const newUser = await User.create(req.body);
    console.log(newUser);

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong!!!");
  }
};

const signin = (req, res) => {
  res.render("auth/sign-in.ejs");
};

const login = async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.user});

    if(!userInDatabase){
        return res.send('Invalid credinetals');
    }

};


module.exports = {
  signup,
  register,
  signin,
  login,
};
