/* eslint-disable react-hooks/rules-of-hooks */
import jwt, { JwtPayload } from 'jsonwebtoken';
import exp from 'express';
import { useError } from './func.js';

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
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(
            token,
            'RANDOM_TOKEN_SECRET'
        ) as DecodedToken;
        const { userId } = decodedToken;
        if (userId !== req.params.id) {
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
