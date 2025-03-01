const Router = require('express').Router
const userController = require('../controllers/userController')

const router = new Router()

router.post('/registration', userController.registration)
router.post('/login', userController.login)

module.exports = router