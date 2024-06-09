const Comment = require('../models/comment')
const Post = require('../models/post')
const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')

exports.getComments = asyncHandler(async(req, res) => {
    const { comments } = await Post.findById(req.params.postId)
    res.json(comments)
})

exports.createComment = [
    body('text', 'text must not be empty').trim().isLength({ min: 1 }).escape(),
    body('date').isDate(),

    asyncHandler(async(req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.json({ errors: errors.array() })
        }

        const user = await User.findById(req.body.user)
        const comment = new Comment({
            text: req.body.text,
            date: req.body.date,
            user,
        })
        await comment.save()

        const post = await Post.findById(req.params.postId)
        const newComments = post.comments
        newComments.push(comment)
        const newPost = new Post({
            title: post.title,
            text: post.text,
            date: post.date,
            isPublished: post.isPublished,
            comments: newComments,
            user,
            _id: post._id
        })

        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, newPost, { new: true })
        res.status(200).json({ message: 'Successfully created comment'})
    })
]

exports.updateComment = [
    body('text', 'text must not be empty').trim().isLength({ min: 1 }).escape(),
    body('date').isDate(),

    asyncHandler(async(req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.json({ errors: errors.array() })
        }

        const user = await User.findById(req.body.user)
        const comment = new Comment({
            text: req.body.text,
            date: req.body.date,
            // TODO: it should be req.user in the future
            user,
            _id: req.params.commentId
        })

        const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, comment, { new: true })
        res.status(200).json({ message: 'Successfully updated comment' })
    })
]

exports.deleteComment = asyncHandler(async(req, res) => {
    const post = await Post.findById(req.params.postId).populate('comments').exec()
    const deletedComment = await Comment.findById(req.params.commentId)
    const newComments = post.comments.filter((c) => c._id.toString() !== deletedComment._id.toString())
    const newPost = new Post({
        title: post.title,
        text: post.text,
        date: post.date,
        comments: newComments,
        user: post.user,
        _id: post._id
    })

    const updatedPost = await Post.findByIdAndUpdate(req.params.postId, newPost, { new: true })
    await Comment.findByIdAndDelete(req.params.commentId)
    res.status(200).json({ message: 'Successfully deleted comment' })
})