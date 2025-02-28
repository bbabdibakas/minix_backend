const Router = require('express').Router
const userController = require('../controllers/userController')

const router = new Router()

router.get('/users', userController.getAllUsers)
router.post('/users', userController.createUser)

module.exports = router