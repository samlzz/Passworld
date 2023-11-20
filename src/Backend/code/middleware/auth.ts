/* eslint-disable react-hooks/rules-of-hooks */
import jwt, { JwtPayload } from 'jsonwebtoken';
import exp from 'express';
import { decrypt, getEnvVar, useError } from './func.js';

interface DecodedToken extends JwtPayload {
    userId: string;
}

declare module 'express' {
    interface Request {
        auth: {
            userId: string;
        };
    }
}

export const authentified = (
    req: exp.Request,
    res: exp.Response,
    next: exp.NextFunction
) => {
    try {
        const { token } = req.cookies;
        const decodedToken = jwt.verify(token, getEnvVar(res)) as DecodedToken;
        const { userId } = decodedToken;
        const decryptedID = decrypt(req.cookies.userId, getEnvVar(res, true));
        if (userId !== decryptedID) {
            useError(res, { err: 'Veuillez vous reconnectez' }, 401);
        }
        req.auth = {
            userId,
        };
        next();
    } catch (error) {
        useError(res, error, 401);
    }
};
