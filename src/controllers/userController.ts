import {Request, Response, NextFunction} from "express";
import userService from "../services/userService";
import ApiError from "../exceptions/apiError";

interface RegistrationBody {
    name?: string;
    username?: string;
    password?: string;
}

interface LoginBody {
    username?: string;
    password?: string;
}

interface LogoutBody {
    refreshToken?: string;
}

class UserController {
    async registration(req: Request<Record<string, never>, {}, RegistrationBody>, res: Response, next: NextFunction) {
        try {
            const {name, username, password} = req.body
            if (!name || !username || !password) {
                next(ApiError.BadRequest('All fields are required'));
                return
            }
            const user = await userService.registration(name, username, password)
            res.status(200).json(user)
        } catch (e) {
            next(e)
        }
    }

    async login(req: Request<Record<string, never>, {}, LoginBody>, res: Response, next: NextFunction) {
        try {
            const {username, password} = req.body
            if (!username || !password) {
                next(ApiError.BadRequest('All fields are required'));
                return
            }
            const user = await userService.login(username, password)
            res.status(200).json(user)
        } catch (e) {
            next(e);
        }
    }

    async getProfileByUsername(req: Request<{ username: string }>, res: Response, next: NextFunction) {
        try {
            const {username} = req.params
            if (!username) {
                next(ApiError.BadRequest('All fields are required'));
                return
            }

            const user = await userService.getProfileByUsername(username)
            res.status(200).json(user)
        } catch (e) {
            next(e);
        }
    }
}

export default new UserController()