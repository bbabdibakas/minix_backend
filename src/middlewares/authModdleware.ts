import ApiError from "../exceptions/apiError";
import tokenService from "../services/tokenService";
import {Request, Response, NextFunction} from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.Unauthorized());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.Unauthorized());
        }

        const jwtPayload = tokenService.validateAccessToken(accessToken);

        if (!jwtPayload) {
            return next(ApiError.Unauthorized());
        }

        next();
    } catch (e) {
        return next(ApiError.Unauthorized());
    }
};

export default authMiddleware