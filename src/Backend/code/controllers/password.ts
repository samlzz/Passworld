import exp from 'express';
import { Types } from 'mongoose';

import { User, IPassw } from '../models/model_user.js';
import { useError, useReturn } from '../middleware/func.js';

export const addPassword = (req: exp.Request, res: exp.Response) => {
    const { newPsw }: { newPsw: IPassw } = req.body;
    User.findById(req.auth.userId)
        .then((user) => {
            if (!user) useError(res, { err: "User don't found" });
            const newPswSimple = newPsw.toObject ? newPsw.toObject() : newPsw;
            const newPswWithId = {
                ...newPswSimple,
                _id: new Types.ObjectId(),
            };

            if (newPswWithId?.categName) {
                user.pswByCateg.forEach((categ) => {
                    if (categ.name === newPsw?.categName) {
                        categ.passwords.push(newPswWithId);
                    }
                });
            }
            user.allPassw.push(newPswWithId);
            user.save()
                .then(() =>
                    useReturn(res, `Password succesfully added`, 200, {
                        pswId: newPswWithId._id,
                    })
                )
                .catch((e) => useError(res, e));
        })
        .catch((e) => useError(res, e));
};

export const deletePassword = (req: exp.Request, res: exp.Response) => {
    const { pswId, categName } = req.body;
    User.findById(req.auth.userId)
        .then((user) => {
            if (!user) {
                useError(res, { err: 'Password not found' }, 404);
            }
            const pswLess = user;
            pswLess.allPassw = pswLess.allPassw.filter(
                (psw) => !psw._id.equals(new Types.ObjectId(pswId))
            );
            pswLess.pswByCateg = pswLess.pswByCateg.map((categ) => {
                if (categ.name === categName) {
                    return {
                        ...categ,
                        passwords: categ.passwords.filter(
                            (psw) => !psw._id.equals(new Types.ObjectId(pswId))
                        ),
                    };
                }
                return categ;
            });

            pswLess
                .save()
                .then(() => useReturn(res, 'Password succesfully deleted'))
                .catch((e) => useError(res, e));
        })
        .catch((e) => useError(res, e));
};

export const replaceAPsw = (req: exp.Request, res: exp.Response) => {
    const { editedPsw }: { editedPsw: IPassw } = req.body;

    function replaceGoodPsw(listOfPsw: IPassw[]) {
        return listOfPsw.map((passw) => {
            if (passw._id === editedPsw._id) {
                return editedPsw;
            }
            return passw;
        });
    }

    User.findById(req.auth.userId)
        .then((user) => {
            if (!user) {
                useError(res, { err: 'Password not found' }, 404);
            }
            const editedUser = user;
            editedUser.allPassw = replaceGoodPsw(editedUser.allPassw);
            if (editedPsw.categName) {
                editedUser.pswByCateg = editedUser.pswByCateg.map((categ) => {
                    if (categ.name === editedPsw.categName) {
                        return {
                            ...categ,
                            passwords: replaceGoodPsw(categ.passwords),
                        };
                    }
                    return categ;
                });
            }
            editedUser
                .save()
                .then(() => useReturn(res, 'Password succesfully edited'))
                .catch((e) => useError(res, e));
        })
        .catch((e) => useError(res, e));
};
