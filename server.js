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

const isSignedIn = require("./middleware/isSignedIn.js");
const addUserToViews = require("./middleware/addUserToViews.js");

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
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  })
);

app.use(addUserToViews);

// PUBLIC ROUTES
app.get('/', async (req, res) => {
  res.render('index.ejs');
});

app.get("/auth/sign-up", authController.signup);
app.post("/auth/sign-up", authController.register);
app.get("/auth/sign-in", authController.signin);
app.post("/auth/sign-in", authController.login);


// Customer middleware
app.use(isSignedIn);

// PRIVATE ROUTES
app.get('/auth/sign-out', authController.signout);

app.get('/protected', async (req, res) => {
  res.send(`You are logged in as ${req.session.user.username}`);
});

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});