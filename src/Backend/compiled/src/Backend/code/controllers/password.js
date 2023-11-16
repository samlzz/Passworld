var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { Types } from 'mongoose';
import { User } from '../models/model_user.js';
import { useError, useReturn } from '../middleware/func.js';
export var addPassword = function (req, res) {
    var newPsw = req.body.newPsw;
    User.findById(req.auth.userId)
        .then(function (user) {
        if (!user)
            useError(res, { err: "User don't found" });
        var newPswSimple = (newPsw === null || newPsw === void 0 ? void 0 : newPsw.toObject) ? newPsw.toObject() : newPsw;
        var newPswWithId = __assign(__assign({}, newPswSimple), { _id: new Types.ObjectId() });
        if (newPswWithId === null || newPswWithId === void 0 ? void 0 : newPswWithId.categName) {
            user.pswByCateg.forEach(function (categ) {
                if (categ.name === (newPsw === null || newPsw === void 0 ? void 0 : newPsw.categName)) {
                    categ.passwords.push(newPswWithId);
                }
            });
        }
        user.allPassw.push(newPswWithId);
        user.save()
            .then(function () {
            return useReturn(res, "Password succesfully added", 200, {
                pswId: newPswWithId._id,
            });
        })
            .catch(function (e) { return useError(res, e); });
    })
        .catch(function (e) { return useError(res, e); });
};
export var deletePassword = function (req, res) {
    var _a = req.body, pswId = _a.pswId, categName = _a.categName;
    User.findById(req.auth.userId)
        .then(function (user) {
        if (!user) {
            useError(res, { err: 'Password not found' }, 404);
        }
        var deletedPsw = user.allPassw.find(function (psw) { return psw._id.toString() === pswId; });
        // Supprime le mpd
        var pswLess = user;
        pswLess.allPassw = pswLess.allPassw.filter(function (psw) { return !psw._id.equals(new Types.ObjectId(pswId)); });
        pswLess.pswByCateg = pswLess.pswByCateg.map(function (categ) {
            if (categ.name === categName) {
                return __assign(__assign({}, categ), { passwords: categ.passwords.filter(function (psw) { return !psw._id.equals(new Types.ObjectId(pswId)); }) });
            }
            return categ;
        });
        pswLess
            .save()
            .then(function () {
            useReturn(res, 'Password succesfully deleted', 200, {
                deletedPsw: deletedPsw,
            });
        })
            .catch(function (e) { return useError(res, e); });
    })
        .catch(function (e) { return useError(res, e); });
};
export var replaceAPsw = function (req, res) {
    var editedPsw = req.body.editedPsw;
    function replaceGoodPsw(listOfPsw) {
        return listOfPsw.map(function (passw) {
            if (passw._id.equals(new Types.ObjectId(editedPsw._id))) {
                return editedPsw;
            }
            return passw;
        });
    }
    User.findById(req.auth.userId)
        .then(function (user) {
        if (!user) {
            useError(res, { err: 'Password not found' }, 404);
        }
        var editedUser = user;
        editedUser.allPassw = replaceGoodPsw(editedUser.allPassw);
        if (editedPsw.categName) {
            editedUser.pswByCateg = editedUser.pswByCateg.map(function (categ) {
                if (categ.name === editedPsw.categName) {
                    return __assign(__assign({}, categ), { passwords: replaceGoodPsw(categ.passwords) });
                }
                return categ;
            });
        }
        editedUser
            .save()
            .then(function () { return useReturn(res, 'Password succesfully edited'); })
            .catch(function (e) { return useError(res, e); });
    })
        .catch(function (e) { return useError(res, e); });
};
