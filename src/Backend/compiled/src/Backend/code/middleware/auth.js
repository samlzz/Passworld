/* eslint-disable react-hooks/rules-of-hooks */
import jwt from 'jsonwebtoken';
import { decrypt, getEnvVar, useError } from './func.js';
import logger from './log.js';
export var authentified = function (req, res, next) {
    try {
        var token = req.cookies.token;
        var decodedToken = jwt.verify(token, getEnvVar(res));
        var userId = decodedToken.userId;
        var decryptedID = decrypt(req.cookies.userId, getEnvVar(res, true));
        if (userId !== decryptedID) {
            useError(res, { err: 'Veuillez vous reconnectez' }, 401);
        }
        req.auth = {
            userId: userId,
        };
        logger.info("Un utilisateur s'est connect\u00E9, SUCCES _id: ".concat(userId));
        next();
    }
    catch (error) {
        logger.info("Un utilisateur s'est connect\u00E9, ERROR _id: ".concat(req.auth.userId));
        useError(res, error, 401);
    }
};
