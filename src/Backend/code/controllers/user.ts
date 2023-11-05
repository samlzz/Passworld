/* eslint-disable react-hooks/rules-of-hooks */
import exp from 'express';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

import { useError, useReturn } from '../middleware/func.js';
import { User } from '../models/model_user.js';

function makeTokenAndReturn(
    res: exp.Response,
    IsLogin: boolean,
    IdOfUser: Types.ObjectId
) {
    if (IsLogin) {
        return useReturn(res, 'User was login', 200, {
            id: IdOfUser,
            token: jwt.sign(
                { userId: IdOfUser },
                'RANDOM_TOKEN_SECRET', // todo: changer par chaine complexe
                { expiresIn: '24h' }
            ),
        });
    }
    return useReturn(res, 'User was created', 201, {
        id: IdOfUser,
        token: jwt.sign(
            { userId: IdOfUser },
            'RANDOM_TOKEN_SECRET', // todo: changer par chaine complexe
            { expiresIn: '24h' }
        ),
    });
}

export const checkIdAndCreate = (req: exp.Request, res: exp.Response) => {
    const { mdp, id } = req.body;
    User.findOne({ email: id })
        .then((user) => {
            if (user) {
                useError(res, { err: 'Email already exists' }, 409);
            } else {
                hash(mdp, 10)
                    .then((cryptedMdp: string) => {
                        const addUser = new User({
                            email: id,
                            motDePasse: cryptedMdp,
                            allPassw: [],
                            pswByCateg: [],
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
    const { id, mdp } = req.body;

    User.findOne({ email: id })
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
