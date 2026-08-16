const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const session = require('express-session');
const MongoStore = require("connect-mongo").MongoStore;

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");

const authController = require("./controllers/auth.js");

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";


mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});


app.get("/", (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});


app.get("/auth/sign-up", authController.signup);
app.post("/auth/sign-up", authController.register);
app.get("/auth/sign-in", authController.signin);
app.post("/auth/sign-in", authController.login);

// PRIVATE ROUTES
app.get('/auth/sign-out', authController.signout);

app.get('/protected', async (req, res) => {
  if (req.session.user) {
    return res.send(`You are logged in as ${req.session.user.username}`);
  }

  res.redirect('/');
});

app.get("/vip-lounge", (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send("Sorry, no guests allowed.");
  }
});

app.get('/login-success', (req, res) => {
    req.session.user = { 
        username: userInDatabase.username 
    }; 
    

    req.session.save((err) => {
        if (err) {
            return res.status(500).send("Session save failed");
        }
        res.redirect("/"); 
    });
});





app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});