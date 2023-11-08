import { User } from '../models/model_user.js';
import { useError, useReturn } from '../middleware/func.js';
export var returnPasswList = function (req, res) {
    var userId = req.auth.userId;
    User.findById(userId)
        .then(function (user) {
        var allPassw = user.allPassw, pswByCateg = user.pswByCateg;
        useReturn(res, null, 200, {
            allPassw: allPassw,
            categPassw: pswByCateg,
        });
    })
        .catch(function (e) { return useError(res, e); });
};
