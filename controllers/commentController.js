const Comment = require('../models/comment')
const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')

exports.getComments = asyncHandler(async(req, res) => {
    const comments = await Comment.find()
    res.json(comments)
})