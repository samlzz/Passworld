import { Types } from 'mongoose';
import { User } from '../models/model_user.js';
import { useError, useReturn } from '../middleware/func.js';
export var addCategory = function (req, res) {
    var userId = req.auth.userId;
    var newCateg = { name: req.body.categName, passwords: [] };
    User.findByIdAndUpdate(userId, { $push: { pswByCateg: newCateg } }, { new: true, runValidators: true })
        .then(function (result) {
        if (!result)
            useError(res, { err: "User don't found" });
        useReturn(res, 'Category succesfully added', 200, {
            categ: result,
        });
    })
        .catch(function (e) { return useError(res, e); });
};
export var deleteCategory = function (req, res) {
    var categId = req.body.categId;
    User.findById(req.auth.userId)
        .then(function (user) {
        if (!user) {
            useError(res, { err: 'Category not found' }, 404);
        }
        var categLess = user;
        categLess.pswByCateg = categLess.pswByCateg.filter(function (categ) { return !categ._id.equals(new Types.ObjectId(categId)); });
        categLess
            .save()
            .then(function () { return useReturn(res, 'Category succesfully deleted'); })
            .catch(function (e) { return useError(res, e); });
    })
        .catch(function (e) { return useError(res, e); });
};
