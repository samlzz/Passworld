import exp from 'express';

import { User } from '../models/model_user.js';
import { useError, useReturn } from '../middleware/func.js';

export const returnPasswList = (req: exp.Request, res: exp.Response) => {
    const { userId } = req.auth;
    User.findById(userId)
        .then((user) => {
            const { allPassw, pswByCateg } = user;
            useReturn(res, null, 200, {
                allPassw,
                pswByCateg,
            });
        })
        .catch((e) => useError(res, e));
};
