var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import crypto from 'crypto';
import dotenv from 'dotenv';
import logger from './log.js';
export var useError = function (res, error, statusCode) {
    if (statusCode === void 0) { statusCode = 500; }
    logger.error(error);
    return res.status(statusCode).json(error);
};
export var useReturn = function (res, message, statusCode, data) {
    if (statusCode === void 0) { statusCode = 200; }
    if (data === void 0) { data = null; }
    if (data === null) {
        logger.info(message);
        return res.status(statusCode).json({ msg: message });
    }
    if (message === null) {
        logger.info(data);
        return res.status(statusCode).json(data);
    }
    logger.info(message, data);
    var toReturn = __assign({ msg: message }, data);
    return res.status(statusCode).json(toReturn);
};
export var getEnvVar = function (res, isUserId) {
    if (isUserId === void 0) { isUserId = false; }
    var result = dotenv.config();
    if (result.error) {
        useError(res, { err: 'Server fail to get key' });
    }
    if (isUserId)
        return process.env.KEY_FOR_USERID;
    return process.env.JWT_SECRET_KEY;
};
export var encrypt = function (mdp, userID) {
    try {
        var key = void 0;
        if (userID.length === 32) {
            key = userID;
        }
        else if (userID.length === 24) {
            key = userID + process.env.HEX_FOR_AES;
        }
        else
            throw new Error('wrong length of arguments');
        if (key.length !== 32)
            throw new Error('Longueur de clé invalide');
        var algorithm = 'aes-128-cbc';
        var iv = crypto.randomBytes(16);
        var cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
        var encrypted = cipher.update(mdp);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return {
            iv: iv.toString('hex'),
            encryptedMdp: encrypted.toString('hex'),
        };
    }
    catch (error) {
        logger.error('Erreur pendant le criptage', error);
        return null;
    }
};
export var decrypt = function (mdp, userId) {
    try {
        var key = void 0;
        if (userId.length === 32) {
            key = userId;
        }
        else if (userId.length === 24) {
            key = userId + process.env.HEX_FOR_AES;
        }
        else
            throw new Error('wrong length of arguments');
        if (key.length !== 32)
            throw new Error('Longueur de clé invalide');
        var algorithm = 'aes-128-cbc';
        var iv = Buffer.from(mdp.iv, 'hex');
        var encryptedText = Buffer.from(mdp.encryptedMdp, 'hex');
        var decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv);
        var decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
    catch (error) {
        logger.error('Erreur pendant le décriptage', error);
        return null;
    }
};
