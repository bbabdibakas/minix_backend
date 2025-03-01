const prisma = require('../database/index')
const ApiError = require("../exceptions/apiError");
const bcrypt = require("bcrypt");

class UserService {
    async registration(name, username, password) {
        const existedUser = await prisma.user.findFirst({where: {username: username}});
        if (existedUser) {
            throw ApiError.BadRequest('User with that username already exists.')
        }

        const hashPassword = await bcrypt.hash(password, 3);
        return prisma.user.create({data: {name, username, password: hashPassword}});
    }

    async login(username, password) {
        const existedUser = await prisma.user.findFirst({where: {username: username}});
        if (!existedUser) {
            throw ApiError.NotFound('User with that username not found.')
        }

        const isPasswordValid = await bcrypt.compare(password, existedUser.password);
        if (!isPasswordValid) {
            throw ApiError.BadRequest('Invalid username or password.');
        }

        return existedUser;
    }
}

module.exports = new UserService()