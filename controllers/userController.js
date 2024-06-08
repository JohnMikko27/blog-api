const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')

exports.getUsers = asyncHandler(async(req, res) => {
    const users = await User.find()
    res.json(users)
})