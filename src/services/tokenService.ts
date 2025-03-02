import {Prisma, Token, User} from "@prisma/client";
import jsonwebtoken from "jsonwebtoken";

class TokenService {
    generateTokens(payload: Omit<User, 'bio' | 'password' | 'createdAt'>) {
        if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
            throw new Error('JWT secrets are not defined.')
        }

        const accessToken = jsonwebtoken.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '60s'})
        const refreshToken = jsonwebtoken.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30m'})

        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(accessToken: string) {
        try {
            if (!process.env.JWT_ACCESS_SECRET) {
                throw new Error('JWT secrets are not defined.')
            }
            return jsonwebtoken.verify(accessToken, process.env.JWT_ACCESS_SECRET)
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async saveToken(trx: Prisma.TransactionClient, userId: number, refreshToken: string): Promise<Token> {
        const existedToken = await trx.token.findUnique({where: {userId: userId}});

        if (existedToken) {
            return trx.token.update({
                where: {id: existedToken.id},
                data: {refreshToken}
            });
        }

        return trx.token.create({
            data: {userId, refreshToken}
        })
    }
}

export default new TokenService()