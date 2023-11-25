import exp from 'express';

import { User } from '../models/model_user.js';
import { useError, useReturn, decrypt } from '../middleware/func.js';

export const returnPasswList = (req: exp.Request, res: exp.Response) => {
    const { userId } = req.auth;
    User.findById(userId)
        .then((user) => {
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

export const returnForSetting = (req: exp.Request, res: exp.Response) => {
    const { userId } = req.auth;
    User.findById(userId)
        .then((user) => {
            const identifier = user.email;
            const nbOfPassw = user.allPassw.length;
            useReturn(res, null, 200, { identifier, nbOfPassw });
        })
        .catch((e) => useError(res, e));
};
