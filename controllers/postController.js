const Post = require('../models/post')
const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')

exports.getPosts = asyncHandler(async(req, res) => {
    const posts = await Post.find()
    res.json(posts)
})

exports.createPost = [
    // body('postTitle', 'post title is not empty').trim().isLength({ min: 1 }).escape(),
    // body('postText', 'post text is not empty').trim().isLength({ min: 1 }).escape(),
    // body('postDate', 'post date is not empty').trim().isLength({ min: 1 }).escape(),
    // body('postIsPublished', 'post date is not empty').trim().isLength({ min: 1 }).escape(),

    asyncHandler(async(req, res) => {
        const post = new Post({
            title: req.body.title,
            text: req.body.text,
            date: req.body.date,
            isPublished: req.body.isPublished,
            comments: (req.body.comments === undefined ? [] : comments),
            // its prob not adding user cuz its not an actual user
            // user req.user in the future
            user: req.body.user
        })
        console.log('here')
        console.log(post)
        console.log(post.user)
        // await post.save()
        // res.json({ post })
        res.json(post)
    })
]

// exports.updatePost = [
//     // do sanitizing here

//     asyncHandler(async(req, res) => {
//         const post = new Post({

//         })
//     })
// ]