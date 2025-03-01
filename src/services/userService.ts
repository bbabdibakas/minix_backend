import {User} from "@prisma/client";
import prisma from "../database/index";
import bcrypt from "bcrypt";
import ApiError from "../exceptions/apiError";

class UserService {
    async registration(name: string, username: string, password: string): Promise<User> {
        const existedUser = await prisma.user.findUnique({where: {username: username}});
        if (existedUser) {
            throw ApiError.BadRequest('User with that username already exists.')
        }

        const hashPassword = await bcrypt.hash(password, 3);
        return prisma.user.create({data: {name, username, password: hashPassword}});
    }

    async login(username: string, password: string): Promise<User> {
        const existedUser = await prisma.user.findUnique({where: {username: username}});
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

export default new UserService()