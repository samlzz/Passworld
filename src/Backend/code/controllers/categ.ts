import exp from 'express';

import { User } from '../models/model_user.js';
import { useError, useReturn } from '../middleware/func.js';

export const addCategory = (req: exp.Request, res: exp.Response) => {
    const { userId } = req.auth;
    const newCateg = { name: req.body.categName, passwords: [] };
    User.findByIdAndUpdate(
        userId,
        { $push: { pswByCateg: newCateg } },
        { new: true, runValidators: true }
    )
        .then((result) => {
            if (!result) useError(res, { err: "User don't found" });
            const addedCateg = result.pswByCateg.find(
                (categ) => categ.name === newCateg.name
            );
            useReturn(res, 'Category succesfully added', 200, {
                addedCateg: addedCateg._id,
            });
        })
        .catch((e) => useError(res, e));
};

export const deleteCategory = (req: exp.Request, res: exp.Response) => {
    const { categId } = req.body;
    User.findById(req.auth.userId)
        .then((user) => {
            if (!user) useError(res, { err: 'Category not found' }, 404);

            const categLess = user;
            categLess.pswByCateg = categLess.pswByCateg.filter((categ) => {
                if (categ.name === 'SearchContent') {
                    return true;
                }
                if (categ._id.toString() === categId) {
                    return false;
                }
                return true;
            });
            categLess
                .save()
                .then(() => useReturn(res, 'Category succesfully deleted'))
                .catch((e) => useError(res, e));
        })
        .catch((e) => useError(res, e));
};

export const moveACateg = (req: exp.Request, res: exp.Response) => {
    const { userId } = req.auth;
    User.findById(userId)
        .then((user) => {
            if (!user) useError(res, { err: 'Category not found' }, 404);
            const { indexOfCateg, newIndex } = req.body;
            // ? destruct pour recup la categ car splice->categ[]
            const [categoryToMove] = user.pswByCateg.splice(indexOfCateg, 1);
            user.pswByCateg.splice(newIndex, 0, categoryToMove);
            user.save()
                .then(() => useReturn(res, 'Category succesfully moved'))
                .catch((e) => useError(res, e));
        })
        .catch((e) => useError(res, e));
};
