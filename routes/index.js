const express = require('express');
const router = express.Router();
const passport = require('passport')
const jwt = require('jsonwebtoken')
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs')
require('dotenv').config()


const isAuth = async(req, res, next) => {
  if (req.isAuthenticated()) {
      next()
  } else {
      res.status(401).json({msg: 'You are not authorized to view this resource'})
  }
}

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization']
  if (bearerHeader !== undefined) {
    const bearer = bearerHeader.split(" ")
    const bearerToken = bearer[1]
    req.token = bearerToken
    next()
  } else {
    res.status(403).json({ message: 'You are forbidden to access this resource'})
  }
}

router.get('/', function(req, res, next) {
  res.render('index', { title: 'mikko' });
});

// when I login with the frontend, I have to save the token 
// that I get back as a response in local storage
router.get('/loggedIn', (req, res) => {
  const user = JSON.parse(JSON.stringify(req.user))
  jwt.sign(user, process.env.SECRET, (err, token) => {
    console.log(req.user)
    if (err) {
      res.status(403).json({ 
        message: 'You are forbidden to access this resource', 
        error: err
      })
      return;
    }
    res.json({ token })
  })
})

// i successfully loggedin just clean it up and put in proper places now 

router.post('/example', verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRET, (err, authData) => {
    if (err) {
      res.status(403).json({ message: 'You are forbidden to access this resource'})
      return;
    }
    res.json({
      message: "Post created",
      authData
    })
  })
})

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
