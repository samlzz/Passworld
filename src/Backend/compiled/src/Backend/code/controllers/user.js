import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { encrypt, getEnvVar, useError, useReturn } from '../middleware/func.js';
import { User } from '../models/model_user.js';
import logger from '../middleware/log.js';
function makeTokenAndReturn(res, IsLogin, IdOfUser) {
    var token = jwt.sign({ userId: IdOfUser.toHexString() }, getEnvVar(res), {
        expiresIn: '24h',
    });
    res.cookie('token', token, {
        httpOnly: true,
        // secure: true, //? Le cookie est envoyé uniquement sur HTTPS  ||  décommenter quand site en HTTPS
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // ?expiration de 24 heures
    });
    res.cookie('userId', encrypt(IdOfUser.toHexString(), getEnvVar(res, true)), {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
    });
    if (IsLogin) {
        return useReturn(res, 'User was login');
    }
    return useReturn(res, 'User was created');
}
var searchCateg = {
    name: 'SearchContent',
    passwords: [],
};
export var checkIdAndCreate = function (req, res) {
    var _a = req.body, mdp = _a.mdp, email = _a.email;
    User.findOne({ email: email })
        .then(function (user) {
        if (user) {
            useError(res, { err: 'Email already exists' }, 409);
        }
        else {
            hash(mdp, 10)
                .then(function (cryptedMdp) {
                var addUser = new User({
                    email: email,
                    motDePasse: cryptedMdp,
                    allPassw: [],
                    pswByCateg: [searchCateg],
                });
                addUser
                    .save()
                    .then(function () {
                    return makeTokenAndReturn(res, false, addUser._id);
                })
                    .catch(function (e) { return useError(res, e); });
            })
                .catch(function (e) { return useError(res, e); });
        }
    })
        .catch(function (e) { return useError(res, e); });
};
export var checkIdAndMdp = function (req, res) {
    var _a = req.body, email = _a.email, mdp = _a.mdp;
    User.findOne({ email: email })
        .then(function (user) {
        if (!user) {
            return useError(res, { err: 'Email or password are wrong' }, 401);
        }
        compare(mdp, user.motDePasse)
            .then(function (valid) {
            if (!valid) {
                return useError(res, { err: 'Email or password are wrong' }, 401);
            }
            return makeTokenAndReturn(res, true, user._id);
        })
            .catch(function (e) { return useError(res, e); });
        return null;
    })
        .catch(function (e) { return useError(res, e); });
};
export var deleteUser = function (req, res) {
    var userId = req.body.userId;
    User.findByIdAndDelete(userId)
        .then(function (result) {
        if (!result) {
            return useError(res, { err: 'User not found' }, 404);
        }
        return useReturn(res, 'User has been deleted', 200, {
            deletedUser: result,
        });
    })
        .catch(function (e) { return useError(res, e); });
};
export var deleteCookies = function (req, res) {
    try {
        res.cookie('token', '', { expires: new Date(0) });
        res.cookie('userId', '', { expires: new Date(0) });
        logger.info("Un utilisateur s'est d\u00E9connect\u00E9, SUCCES _id: ".concat(req.auth.userId));
        useReturn(res, 'Cookies have been reset');
    }
    catch (err) {
        logger.info("Un utilisateur s'est d\u00E9connect\u00E9, ERROR _id: ".concat(req.auth.userId));
        useError(res, err);
    }
};
export var checkMdp = function (req, res) {
    var userId = req.auth.userId;
    var mdpToCheck = req.body.mdpToCheck;
    User.findById(userId)
        .then(function (user) {
        compare(mdpToCheck, user.motDePasse)
            .then(function (valid) {
            if (!valid)
                useError(res, { err: 'Email or password are wrong' }, 401);
            else
                useReturn(res, 'Good');
        })
            .catch(function (e) { return useError(res, e); });
    })
        .catch(function (e) { return useError(res, e); });
};
export var editUserEmailOrPsw = function (req, res) {
    var userId = req.auth.userId;
    User.findById(userId)
        .then(function (user) {
        var _a, _b;
        if (!user)
            useError(res, { err: "User don't found" });
        var updatedUser = user;
        if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.newEmail) {
            updatedUser.email = req.body.newEmail;
        }
        if ((_b = req.body) === null || _b === void 0 ? void 0 : _b.newMdp) {
            compare(req.body.oldMdp, user.motDePasse)
                .then(function (valid) {
                if (!valid)
                    useError(res, { err: 'Email or password are wrong' }, 401);
                else
                    hash(req.body.newMdp, 10)
                        .then(function (hashedMdp) {
                        updatedUser.motDePasse = hashedMdp;
                        updatedUser
                            .save()
                            .then(function () {
                            return useReturn(res, 'User was correctly edited');
                        })
                            .catch(function (e) { return useError(res, e); });
                    })
                        .catch(function (e) { return useError(res, e); });
            })
                .catch(function (e) { return useError(res, e); });
        }
        else
            updatedUser
                .save()
                .then(function () { return useReturn(res, 'User was correctly edited'); })
                .catch(function (e) { return useError(res, e); });
    })
        .catch(function (e) { return useError(res, e); });
};
export var resetMdpOfAUser = function (req, res) {
    var _a = req.body, email = _a.email, newMDP = _a.newMDP;
    User.findOne({ identifier: email })
        .then(function (user) {
        if (!user)
            useError(res, { err: "Don't find user" });
        var updatedUser = user;
        hash(newMDP, 10)
            .then(function (chiffred) {
            updatedUser.motDePasse = chiffred;
            updatedUser
                .save()
                .then(function () {
                return useReturn(res, 'Password was correctly reset');
            })
                .catch(function (e) { return useError(res, e); });
        })
            .catch(function (e) { return useError(res, e); });
    })
        .catch(function (e) { return useError(res, e); });
};
