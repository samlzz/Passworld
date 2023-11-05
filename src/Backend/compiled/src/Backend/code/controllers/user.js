import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { useError, useReturn } from '../middleware/func.js';
import { User } from '../models/model_user.js';
function makeTokenAndReturn(res, IsLogin, IdOfUser) {
    if (IsLogin) {
        return useReturn(res, 'User was login', 200, {
            id: IdOfUser,
            token: jwt.sign({ userId: IdOfUser }, 'RANDOM_TOKEN_SECRET', // todo: changer par chaine complexe
            { expiresIn: '24h' }),
        });
    }
    return useReturn(res, 'User was created', 201, {
        id: IdOfUser,
        token: jwt.sign({ userId: IdOfUser }, 'RANDOM_TOKEN_SECRET', // todo: changer par chaine complexe
        { expiresIn: '24h' }),
    });
}
export var checkIdAndCreate = function (req, res) {
    var _a = req.body, mdp = _a.mdp, id = _a.id;
    User.findOne({ email: id })
        .then(function (user) {
        if (user) {
            useError(res, { err: 'Email already exists' }, 409);
        }
        else {
            hash(mdp, 10)
                .then(function (cryptedMdp) {
                var addUser = new User({
                    email: id,
                    motDePasse: cryptedMdp,
                    allPassw: [],
                    pswByCateg: [],
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
    var _a = req.body, id = _a.id, mdp = _a.mdp;
    User.findOne({ email: id })
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
