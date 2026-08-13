const user = require('../models/user')
const express = require("express");

const bcrypt = require("bcrypt");

const User = require("../models/user.js");

const signup = (req, res) => {
  res.render("auth/sign-up.ejs");
};

const register = async (req, res) => {
    try {
        const userInDatabase = await User.findOne({username: req.body.username});

        if(userInDatabase){
            return res.send('Invalid input');
        }

        if(req.body.password !== req.body.confirempasword) {
            return res.send('Invalid input');
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hashedPassword;


        const user = user.create(req.body);

        console.log(user);
        res.redirect('/')
    } catch (err) {
        console.log(err);
        res.send('somthing wrong!!!')
    }
};

module.exports ={
    signup,
    register,
};

