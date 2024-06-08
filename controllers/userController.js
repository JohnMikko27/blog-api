const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')

exports.getUsers = asyncHandler(async(req, res) => {
    const users = await User.find()
    res.json(users)
})

exports.createUser = [
    body('username', 'username must not be empty').trim().isLength({ min: 1 }).escape(),
    body('password', 'password must not be empty').trim().isLength({ min: 1 }).escape(),
    body('confirmPassword', 'passwords do not match').custom((value, { req }) => {
        return value === req.body.password;
    }),
    body('isAuthor', 'isAuthor must be type Boolean').isBoolean(),

    asyncHandler(async(req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.json({ errors: errors.array() })
        }
        
        bcrypt.hash(req.body.password, 10, async(err, hashedPassword) => {
            try {
                const user = new User({
                    username: req.body.username,
                    password: hashedPassword,
                    isAuthor: req.body.isAuthor
                })
                await user.save()
                res.status(200).json({ message: 'Successfully created user' })
            } catch(e) {
                console.log(e)
            }
        })
    })
]

exports.updateUser = [
    body('username', 'username must not be empty').trim().isLength({ min: 1 }).escape(),
    body('password', 'password must not be empty').trim().isLength({ min: 1 }).escape(),
    body('confirmPassword', 'passwords do not match').custom((value, { req }) => {
        return value === req.body.password;
    }),
    body('isAuthor', 'isAuthor must be type Boolean').isBoolean(),

    asyncHandler(async(req, res) => {
        bcrypt.hash(req.body.password, 10, async(err, hashedPassword) => {
            try {
                const user = new User({
                    username: req.body.username,
                    password: hashedPassword,
                    isAuthor: req.body.isAuthor,
                    _id: req.params.userId
                })
                const updatedUser = await User.findByIdAndUpdate(req.params.userId, user, { new: true })
                res.status(200).json({ message: 'Successfully updated user' })
            } catch(e) {
                console.log(e)
            }
        })
    })
]

exports.deleteUser = asyncHandler(async(req, res) => {
    const user = await User.findByIdAndDelete(req.params.userId)
    if (!user) res.status(404).json({ message: 'User not found' })
    res.status(200).json({ message: 'Successfully deleted user' })
})