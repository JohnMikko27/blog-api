const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')

const indexRouter = require('./routes/index');
const postRouter = require('./routes/postRouter')
const userRouter = require('./routes/userRouter')
const commentRouter = require('./routes/commentRouter')
require('dotenv').config();
require('./routes/passport')

const app = express();

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const MongoStore = require('connect-mongo');

app.use(session({ 
  secret: process.env.SECRET, 
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'session'
  }),
  resave: false, 
  saveUninitialized: true,
}));
app.use(passport.session());

app.use('/', indexRouter);
app.use('/posts', postRouter);
app.use('/users', userRouter);
app.use('/posts', commentRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
