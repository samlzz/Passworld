import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { useError, useReturn } from '../middleware/func.js';
import { User } from '../models/model_user.js';
function makeTokenAndReturn(res, IsLogin, IdOfUser) {
    var token = jwt.sign({ userId: IdOfUser }, 'RANDOM_TOKEN_SECRET', // todo: changer par chaine complexe
    { expiresIn: '24h' });
    res.cookie('token', token, {
        httpOnly: true,
        // todo: décommenter quand site en HTTPS
        // secure: true, //? Le cookie est envoyé uniquement sur HTTPS
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // ?expiration de 24 heures
    });
    res.cookie('userId', IdOfUser, {
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
        useReturn(res, 'Cookies have been reset');
    }
    catch (err) {
        useError(res, err);
    }
};
