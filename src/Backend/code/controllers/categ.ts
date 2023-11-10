import exp from 'express';

import { ICateg, User } from '../models/model_user.js';
import { useError, useReturn } from '../middleware/func.js';

export const addCategory = (req: exp.Request, res: exp.Response) => {
    const { userId } = req.auth;
    const newCateg: ICateg = { name: req.body.categName, passwords: [] };
    User.findByIdAndUpdate(
        userId,
        { $push: { pswByCateg: newCateg } },
        { new: true, runValidators: true }
    )
        .then((result) => {
            if (!result) useError(res, { err: "User don't found" });
            useReturn(res, 'Category succesfully added', 200, {
                addedCateg: result,
            });
        })
        .catch((e) => useError(res, e));
};

export const deleteCategory = (req: exp.Request, res: exp.Response) => {
    const { categId } = req.body;
    User.findById(req.auth.userId)
        .then((user) => {
            if (!user) {
                useError(res, { err: 'Category not found' }, 404);
            }
            const categLess = user;
            categLess.pswByCateg = categLess.pswByCateg.filter(
                (categ) => !categ._id.toString() === categId
            );
            categLess
                .save()
                .then(() => useReturn(res, 'Category succesfully deleted'))
                .catch((e) => useError(res, e));
        })
        .catch((e) => useError(res, e));
};
