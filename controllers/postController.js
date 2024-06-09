const Post = require('../models/post')
const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')

exports.getPosts = asyncHandler(async(req, res) => {
    const posts = await Post.find()
    res.json(posts)
})

exports.getPostDetails = asyncHandler(async(req, res) => {
    const post = await Post.findById(req.params.postId)
    res.json(post)
})

exports.createPost = [
    body('title', 'post title must not empty').trim().isLength({ min: 1 }).escape(),
    body('text', 'post text must not empty').trim().isLength({ min: 1 }).escape(),
    body('date', 'post date must be type Date').trim().isDate().escape(),
    body('isPublished', 'post isPublished must be type Boolean').trim().isBoolean().escape(),
    
    asyncHandler(async(req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.json({ errors: errors.array() })
        }

        const user = await User.findById(req.body.user)
        const post = new Post({
            title: req.body.title,
            text: req.body.text,
            date: req.body.date,
            isPublished: req.body.isPublished,
            comments: (req.body.comments === undefined ? [] : req.body.comments),
            // use req.user in the future
            // user: req.body.user
            user,
        })
        console.log(post)
        // right now I'll just send a status code of 200 for success
        // but maybe send a 201 later that has the location of the updated resource
        await post.save()
        res.status(200).json({ message: 'Succesfully created post' })
    })
]

exports.updatePost = [
    body('title', 'post title must not empty').trim().isLength({ min: 1 }).escape(),
    body('text', 'post text must not empty').trim().isLength({ min: 1 }).escape(),
    body('date', 'post date must be type Date').trim().isDate().escape(),
    body('isPublished', 'post isPublished must be type Boolean').trim().isBoolean().escape(),

    asyncHandler(async(req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.json({ errors: errors.array() })
        }

        const user = await User.findById(req.body.user)
        const oldPost = await Post.findById(req.params.postId)
        const newComments = oldPost.comments
        if (req.body.comments !== undefined) {
            req.body.comments.forEach(c => {
                newComments.push(c)
            })
        }
        const post = new Post({
            title: req.body.title,
            text: req.body.text,
            date: req.body.date,
            isPublished: req.body.isPublished,
            comments: newComments,
            // TODO
            // use req.user in the future
            // user: req.body.user
            user,
            _id: req.params.postId
        })

        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, post, { new: true })
        res.status(200).json({ message: 'Succesfully updated post' })
    })
]

exports.deletePost = asyncHandler(async(req, res) => {
    // TODO: there should be a check to see if that post exists in the first place
    const post = await Post.findByIdAndDelete(req.params.postId)
    if (!post) res.status(404).json({ message: 'Post not found' })
    res.status(200).json({ message: 'Succesfully deleted post' })
})