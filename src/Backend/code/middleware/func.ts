/* eslint-disable react-hooks/rules-of-hooks */
import exp from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';

import logger from './log.js';
import { CryptedPsw } from '../models/model_user';

export const useError = (
    res: exp.Response,
    error: Error | { err: string },
    statusCode: number = 500
) => {
    console.log(error);
    logger.error(error);
    return res.status(statusCode).json(error);
};

export const useReturn = <T>(
    res: exp.Response,
    message: string | null,
    statusCode: number = 200,
    data: T | null = null
) => {
    if (data === null) {
        logger.info(message);
        return res.status(statusCode).json({ msg: message });
    }
    if (message === null) {
        return res.status(statusCode).json(data);
    }
    logger.info(message);
    const toReturn: Record<string, unknown> = { msg: message, ...data };
    return res.status(statusCode).json(toReturn);
};

export const getEnvVar = (res: exp.Response, isUserId: boolean = false) => {
    const result = dotenv.config();
    if (result.error) {
        useError(res, { err: 'Server fail to get key' });
    }
    if (isUserId) return process.env.KEY_FOR_USERID;
    return process.env.JWT_SECRET_KEY;
};

export const encrypt = (mdp: string, userID: string): CryptedPsw => {
    try {
        let key;
        if (userID.length === 32) {
            key = userID;
        } else if (userID.length === 24) {
            key = userID + process.env.HEX_FOR_AES;
        } else throw new Error('wrong length of arguments');

        if (key.length !== 32) throw new Error('Longueur de clé invalide');
        const algorithm = 'aes-128-cbc';
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv(
            algorithm,
            Buffer.from(key, 'hex'),
            iv
        );
        let encrypted = cipher.update(mdp);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return {
            iv: iv.toString('hex'),
            encryptedMdp: encrypted.toString('hex'),
        };
    } catch (error) {
        logger.error('Erreur pendant le criptage', error);
        return null;
    }
};

export const decrypt = (mdp: CryptedPsw, userId: string): string => {
    try {
        let key;
        if (userId.length === 32) {
            key = userId;
        } else if (userId.length === 24) {
            key = userId + process.env.HEX_FOR_AES;
        } else throw new Error('wrong length of arguments');

        if (key.length !== 32) throw new Error('Longueur de clé invalide');
        const algorithm = 'aes-128-cbc';
        const iv = Buffer.from(mdp.iv, 'hex');
        const encryptedText = Buffer.from(mdp.encryptedMdp, 'hex');

        const decipher = crypto.createDecipheriv(
            algorithm,
            Buffer.from(key, 'hex'),
            iv
        );
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    } catch (error) {
        logger.error('Erreur pendant le décriptage', error);
        return null;
    }
};
