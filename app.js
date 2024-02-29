require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./google-passport');
const cookieSession = require('cookie-session');

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
};


var app = express();
app.use(cors(corsOptions));
app.use(session({
  secret: 'your_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true } // You can adjust cookie settings as needed
}));

app.use(passport.initialize());
app.use(passport.session());
// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toUTCString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.json({message: "You are not logged in"})
})

app.get("/failed", (req, res) => {
  res.send("Failed")
})
app.get("/success", (req, res) => {
  res.send(`Welcome ${req.user}`)
})

app.get('/api/auth/google',
  passport.authenticate('google', {
          scope:
              ['email']
      }
  ));

app.get('/auth/google/callback',
  passport.authenticate('google', {
      failureRedirect: '/failed',
  }),
  function (req, res) {
      console.log(req)
      res.redirect('/success')

  }
);
var indexRouter = require('./modules/route.js');
let rateLimit = require('express-rate-limit');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());






app.use('/api', indexRouter);

// Custom 404 middleware
app.use((req, res, next) => {
    res.status(404).send('Sorry, the requested route was not found.');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


module.exports = app;
