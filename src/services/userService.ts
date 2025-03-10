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

            // TODO: have to simplify return data
            return {
                userData: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    bio: user.bio,
                    createdAt: user.createdAt,
                },
                tokenData: {
                    ...tokens
                }
            }
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

            // TODO: have to simplify return data
            return {
                userData: {
                    id: existedUser.id,
                    name: existedUser.name,
                    username: existedUser.username,
                    bio: existedUser.bio,
                    createdAt: existedUser.createdAt,
                },
                tokenData: {
                    ...tokens
                }
            }
        })
    }

    async getUserByUsername(username: string) {
        const existedUser = await prisma.user.findUnique({where: {username: username}});
        if (!existedUser) {
            throw ApiError.NotFound('User with that username not found.')
        }

        // TODO: have to simplify return data
        return {
            id: existedUser.id,
            name: existedUser.name,
            username: existedUser.username,
            bio: existedUser.bio,
            createdAt: existedUser.createdAt,
        }
    }

    async editUserById(id: number, username: string, name: string, bio: string) {
        const existedUser = await prisma.user.findUnique({where: {id: id}});
        if (!existedUser) {
            throw ApiError.NotFound('User with that id not found.')
        }

        const updatedUser = await prisma.user.update({
            where: {id: id}, data: {
                name: name,
                username: username,
                bio: bio,
            }
        })

        // TODO: have to simplify return data
        return {
            id: updatedUser.id,
            name: updatedUser.name,
            username: updatedUser.username,
            bio: updatedUser.bio,
            createdAt: updatedUser.createdAt,
        }
    }
}

export default new UserService()