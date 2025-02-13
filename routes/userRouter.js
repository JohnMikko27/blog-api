const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/', userController.getUsers)

router.post('/', userController.createUser)

router.put('/:userId', userController.updateUser)

router.delete('/:userId', userController.deleteUser)

module.exports = router