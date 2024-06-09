const express = require('express')
const router = express.Router()
const commentController = require('../controllers/commentController')

router.get('/:postId/comments', commentController.getComments)

router.post('/:postId/comments', commentController.createComment)

router.put('/:postId/comments/:commentId', commentController.updateComment)

router.delete('/:postId/comments/:commentId', commentController.deleteComment)

module.exports = router