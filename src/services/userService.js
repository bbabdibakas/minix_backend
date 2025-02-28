const prisma = require('../database/index')

class UserService {
    async createUser(name, username, password) {
        const existedUser = await prisma.user.findFirst({where: {username: username}});
        if (existedUser) {
            console.log('User already exists.');
            console.log('skipping...')
            return {message: 'User already exists.'};
        }
        return prisma.user.create({data: {name, username, password}})
    }

    async getAllUsers() {
        return prisma.user.findMany()
    }
}

module.exports = new UserService()