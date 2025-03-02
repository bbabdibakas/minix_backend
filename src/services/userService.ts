import prisma from "../database/index";
import bcrypt from "bcrypt";
import ApiError from "../exceptions/apiError";
import tokenService from "./tokenService";

class UserService {
    async registration(name: string, username: string, password: string) {
        const existedUser = await prisma.user.findUnique({where: {username: username}});
        if (existedUser) {
            throw ApiError.BadRequest('User with that username already exists.')
        }

        const hashPassword = await bcrypt.hash(password, 3);

        return prisma.$transaction(async (trx) => {
            const user = await trx.user.create({data: {name, username, password: hashPassword}});
            const tokens = tokenService.generateTokens({id: user.id, name: user.name, username: user.username})
            await tokenService.saveToken(trx, user.id, tokens.refreshToken)
            return {...tokens, user}
        })
    }

    async login(username: string, password: string) {
        const existedUser = await prisma.user.findUnique({where: {username: username}});
        if (!existedUser) {
            throw ApiError.NotFound('User with that username not found.')
        }

        const isPasswordValid = await bcrypt.compare(password, existedUser.password);
        if (!isPasswordValid) {
            throw ApiError.BadRequest('Invalid username or password.');
        }

        return prisma.$transaction(async (trx) => {
            const tokens = tokenService.generateTokens({
                id: existedUser.id,
                name: existedUser.name,
                username: existedUser.username
            })
            await tokenService.saveToken(trx, existedUser.id, tokens.refreshToken)

            return {...tokens, existedUser}
        })
    }

    async logout(refreshToken: string) {
        return tokenService.removeToken(refreshToken);
    }

    async getProfileByUsername(username: string) {
        const existedUser = await prisma.user.findUnique({where: {username: username}});
        if (!existedUser) {
            throw ApiError.NotFound('User with that username not found.')
        }

        return existedUser
    }
}

export default new UserService()