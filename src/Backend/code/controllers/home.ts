import exp from 'express';

import { User } from '../models/model_user.js';
import { useError, useReturn, decrypt } from '../middleware/func.js';
import logger from '../middleware/log.js';

export const returnPasswList = (req: exp.Request, res: exp.Response) => {
    const { userId } = req.auth;
    User.findById(userId)
        .then((user) => {
            logger.info(`utilisateur connecté: ${user}`);
            const { allPassw, pswByCateg } = user;
            const decryptAllPsw = allPassw.map((psw) => ({
                ...psw.toObject(),
                mdp: decrypt(psw.mdp, user._id.toHexString()),
            }));
            const decrypCateg = pswByCateg.map((categ) => ({
                ...categ.toObject(),
                passwords: categ.passwords.map((psw) => ({
                    ...psw.toObject(),
                    mdp: decrypt(psw.mdp, user._id.toHexString()),
                })),
            }));
            useReturn(res, null, 200, {
                allPassw: decryptAllPsw,
                categPassw: decrypCateg,
            });
        })
        .catch((e) => useError(res, e));
};
