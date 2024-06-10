const express = require('express');
const router = express.Router();
const passport = require('passport')
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs')

const isAuth = async(req, res, next) => {
  if (req.isAuthenticated()) {
      next()
  } else {
      res.status(401).json({msg: 'You are not authorized to view this resource'})
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'mikko' });
});

router.get('/loggedIn', (req, res) => res.json({ message: 'Successfully logged in'}))
router.get('/invalidLogin', (req, res) => res.json({ message: 'Failed to login'}))

router.post('/login', passport.authenticate("local", {
  successRedirect: "/loggedIn",
  failureRedirect: "/invalidLogin"
}))

router.get('/protected', isAuth, (req, res) => {
  res.send('got to protected route')
})



// have a post route for signup/register route; i have this already actually i think
// register route just uses bcrypt to hash pw and create user

// then have another post route for login which uses passport local strategy to log in user
// AND use the JWT strategy? so that when the user logs in, they get a JWT token
// look at documentation and fullstack zacks vids on jwt, look if they combine with passport local

// need a logout route also

module.exports = router;
