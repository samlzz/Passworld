/* eslint-disable react-hooks/rules-of-hooks */
import jwt from 'jsonwebtoken';
import { useError } from './func.js';
export var authentified = function (req, res, next) {
    try {
        var token = req.cookies.token;
        var decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        var userId = decodedToken.userId;
        if (userId !== req.cookies.userId) {
            useError(res, { err: 'Veuillez vous reconnectez' }, 401);
        }
        req.auth = {
            userId: userId,
        };
        next();
    }
    catch (error) {
        useError(res, error, 401);
    }
};
