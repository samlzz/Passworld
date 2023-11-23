/* eslint-disable react-hooks/rules-of-hooks */
import exp from 'express';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

import { encrypt, getEnvVar, useError, useReturn } from '../middleware/func.js';
import { User } from '../models/model_user.js';
import logger from '../middleware/log.js';

function makeTokenAndReturn(
    res: exp.Response,
    IsLogin: boolean,
    IdOfUser: Types.ObjectId
) {
    const token = jwt.sign({ userId: IdOfUser.toHexString() }, getEnvVar(res), {
        expiresIn: '24h',
    });
    res.cookie('token', token, {
        httpOnly: true, // ?pas accessible via JavaScript
        // secure: true, //? Le cookie est envoyé uniquement sur HTTPS  ||  décommenter quand site en HTTPS
        sameSite: 'strict', // ?pas envoyé avec les requêtes cross-site
        maxAge: 24 * 60 * 60 * 1000, // ?expiration de 24 heures
    });
    res.cookie(
        'userId',
        encrypt(IdOfUser.toHexString(), getEnvVar(res, true)),
        {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        }
    );
    if (IsLogin) {
        return useReturn(res, 'User was login');
    }
    return useReturn(res, 'User was created');
}

const searchCateg = {
    name: 'SearchContent',
    passwords: [],
};

export const checkIdAndCreate = (req: exp.Request, res: exp.Response) => {
    const { mdp, email } = req.body;
    User.findOne({ email })
        .then((user) => {
            if (user) {
                useError(res, { err: 'Email already exists' }, 409);
            } else {
                hash(mdp, 10)
                    .then((cryptedMdp: string) => {
                        const addUser = new User({
                            email,
                            motDePasse: cryptedMdp,
                            allPassw: [],
                            pswByCateg: [searchCateg],
                        });
                        addUser
                            .save()
                            .then(() =>
                                makeTokenAndReturn(res, false, addUser._id)
                            )
                            .catch((e) => useError(res, e));
                    })
                    .catch((e: Error) => useError(res, e));
            }
        })
        .catch((e) => useError(res, e));
};

export const checkIdAndMdp = (req: exp.Request, res: exp.Response) => {
    const { email, mdp } = req.body;

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return useError(
                    res,
                    { err: 'Email or password are wrong' },
                    401
                );
            }
            compare(mdp, user.motDePasse)
                .then((valid) => {
                    if (!valid) {
                        return useError(
                            res,
                            { err: 'Email or password are wrong' },
                            401
                        );
                    }
                    return makeTokenAndReturn(res, true, user._id);
                })
                .catch((e) => useError(res, e));

            return null;
        })
        .catch((e) => useError(res, e));
};

export const deleteUser = (req: exp.Request, res: exp.Response) => {
    const { userId } = req.body;
    User.findByIdAndDelete(userId)
        .then((result) => {
            if (!result) {
                return useError(res, { err: 'User not found' }, 404);
            }

            return useReturn(res, 'User has been deleted', 200, {
                deletedUser: result,
            });
        })
        .catch((e) => useError(res, e));
};

export const deleteCookies = (req: exp.Request, res: exp.Response) => {
    try {
        res.cookie('token', '', { expires: new Date(0) });
        res.cookie('userId', '', { expires: new Date(0) });
        logger.info(
            `Un utilisateur s'est déconnecté, SUCCES _id: ${req.auth.userId}`
        );
        useReturn(res, 'Cookies have been reset');
    } catch (err) {
        logger.info(
            `Un utilisateur s'est déconnecté, ERROR _id: ${req.auth.userId}`
        );
        useError(res, err);
    }
};
