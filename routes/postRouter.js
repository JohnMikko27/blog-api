const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')

// these routes should have a isLoggedin middleware (before the controller) 
// to check if they're logged in???
router.get('/', postController.getPosts)

router.get('/:postId', postController.getPostDetails)

router.post('/', postController.createPost)

router.put('/:postId', postController.updatePost)

router.delete('/:postId', postController.deletePost)

module.exports = router