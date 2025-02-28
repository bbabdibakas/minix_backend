const userService = require('../services/userService');

class UserController {
    async createUser(req, res) {
        try {
            const {name, username, password} = req.body
            const user = await userService.createUser(name, username, password)
            return res.status(200).json(user)
        } catch (e) {
            console.error(e);
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers()
            return res.status(200).json(users)
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = new UserController();