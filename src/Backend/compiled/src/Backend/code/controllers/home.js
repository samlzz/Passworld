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
import { User } from '../models/model_user.js';
import { useError, useReturn, decrypt } from '../middleware/func.js';
import logger from '../middleware/log.js';
export var returnPasswList = function (req, res) {
    var userId = req.auth.userId;
    User.findById(userId)
        .then(function (user) {
        logger.info("utilisateur connect\u00E9: ".concat(user));
        var allPassw = user.allPassw, pswByCateg = user.pswByCateg;
        var decryptAllPsw = allPassw.map(function (psw) { return (__assign(__assign({}, psw.toObject()), { mdp: decrypt(psw.mdp, user._id.toHexString()) })); });
        var decrypCateg = pswByCateg.map(function (categ) { return (__assign(__assign({}, categ.toObject()), { passwords: categ.passwords.map(function (psw) { return (__assign(__assign({}, psw.toObject()), { mdp: decrypt(psw.mdp, user._id.toHexString()) })); }) })); });
        useReturn(res, null, 200, {
            allPassw: decryptAllPsw,
            categPassw: decrypCateg,
        });
    })
        .catch(function (e) { return useError(res, e); });
};
