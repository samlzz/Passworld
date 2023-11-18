import { User } from '../models/model_user.js';
import { useError, useReturn } from '../middleware/func.js';
export var addCategory = function (req, res) {
    var userId = req.auth.userId;
    var newCateg = { name: req.body.categName, passwords: [] };
    User.findByIdAndUpdate(userId, { $push: { pswByCateg: newCateg } }, { new: true, runValidators: true })
        .then(function (result) {
        if (!result)
            useError(res, { err: "User don't found" });
        var addedCateg = result.pswByCateg.find(function (categ) { return categ.name === newCateg.name; });
        useReturn(res, 'Category succesfully added', 200, {
            addedCateg: addedCateg._id,
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
        categLess.pswByCateg = categLess.pswByCateg.filter(function (categ) {
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
            .then(function () { return useReturn(res, 'Category succesfully deleted'); })
            .catch(function (e) { return useError(res, e); });
    })
        .catch(function (e) { return useError(res, e); });
};
