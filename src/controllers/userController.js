const userService = require('../services/userService');
const ApiError = require('../exceptions/apiError')

class UserController {
    async registration(req, res, next) {
        try {
            const {name, username, password} = req.body
            if (!name || !username || !password) {
                return next(ApiError.BadRequest('All fields are required'));
            }
            const user = await userService.registration(name, username, password)
            return res.status(200).json(user)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const {username, password} = req.body
            const user = await userService.login(username, password)
            return res.status(200).json(user)
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();