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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Types } from 'mongoose';
import axios from 'axios';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { User } from '../models/model_user.js';
import { decrypt, encrypt, useError, useReturn } from '../middleware/func.js';
import logger from '../middleware/log.js';
export var addPassword = function (req, res) {
    function fetchIco(url) {
        return __awaiter(this, void 0, void 0, function () {
            var link, urlObj, withoutPref, icoUrl, response, base64, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        link = url;
                        if (!url.startsWith('http://') && !url.startsWith('https://')) {
                            link = "http://".concat(url);
                        }
                        urlObj = new URL(link);
                        withoutPref = urlObj.hostname;
                        if (withoutPref.startsWith('www.')) {
                            withoutPref = withoutPref.slice(4);
                        }
                        icoUrl = "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.".concat(withoutPref, "&size=50");
                        return [4 /*yield*/, axios.get(icoUrl, {
                                responseType: 'arraybuffer',
                            })];
                    case 1:
                        response = _a.sent();
                        base64 = btoa(new Uint8Array(response.data).reduce(function (data, byte) { return data + String.fromCharCode(byte); }, ''));
                        return [2 /*return*/, "data:image/png;base64,".concat(base64)];
                    case 2:
                        error_1 = _a.sent();
                        logger.error("Erreur lors de la récupération de l'image");
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    var newPsw = req.body.newPsw;
    User.findById(req.auth.userId)
        // eslint-disable-next-line consistent-return
        .then(function (user) { return __awaiter(void 0, void 0, void 0, function () {
        var newPswSimple, mdp, newPswWithId, icoSrc, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!user)
                        useError(res, { err: "User don't found" });
                    newPswSimple = (newPsw === null || newPsw === void 0 ? void 0 : newPsw.toObject) ? newPsw.toObject() : newPsw;
                    mdp = encrypt(newPswSimple.mdp, user._id.toHexString());
                    newPswWithId = __assign(__assign({}, newPswSimple), { _id: new Types.ObjectId(), mdp: mdp });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetchIco(newPswSimple.siteAddress)];
                case 2:
                    icoSrc = _a.sent();
                    if (icoSrc && icoSrc.startsWith('data:image/png;base64')) {
                        newPswWithId = __assign(__assign({}, newPswWithId), { icoLink: icoSrc });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    logger.error('Error when trying to get the icon:', error_2);
                    return [3 /*break*/, 4];
                case 4:
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
                    return [2 /*return*/];
            }
        });
    }); })
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
                var filteredPasswords = categ.passwords.filter(function (psw) { return !psw._id.equals(new Types.ObjectId(pswId)); });
                return __assign(__assign({}, categ), { passwords: filteredPasswords });
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
    var cryptEditPsw = __assign(__assign({}, editedPsw), { mdp: encrypt(editedPsw.mdp, req.auth.userId) });
    User.findById(req.auth.userId)
        .then(function (user) {
        if (!user) {
            useError(res, { err: 'Password not found' }, 404);
        }
        var editedUser = user;
        var oldPsw = editedUser.allPassw.find(function (psw) { return psw._id.toHexString() === editedPsw._id; });
        editedUser.allPassw = editedUser.allPassw.map(function (psw) {
            if (psw._id.toHexString() === editedPsw._id)
                return cryptEditPsw;
            return psw;
        });
        editedUser.pswByCateg = editedUser.pswByCateg.map(function (categ) {
            // ? on retire le mot de passe de son ancienne categ
            if (categ.name === oldPsw.categName &&
                categ.name !== cryptEditPsw.categName) {
                var passwords = categ.passwords.filter(function (psw) {
                    return !psw._id.equals(new Types.ObjectId(editedPsw._id));
                });
                return __assign(__assign({}, categ), { passwords: passwords });
            }
            // ? on ajoute le mot de passe dans sa nouvelle categ
            if (categ.name === cryptEditPsw.categName) {
                var updatedPsws = categ.passwords;
                updatedPsws.push(cryptEditPsw);
                return __assign(__assign({}, categ), { passwords: updatedPsws });
            }
            return categ;
        });
        editedUser
            .save()
            .then(function () { return useReturn(res, 'Password succesfully edited'); })
            .catch(function (e) { return useError(res, e); });
    })
        .catch(function (e) { return useError(res, e); });
};
export var addMultiplePsw = function (req, res) {
    var newpswList = req.body.newpswList;
    User.findById(req.auth.userId)
        .then(function (user) {
        if (!user)
            useError(res, { err: 'Do not find user' });
        var forDataBasePsws = newpswList.map(function (psw) { return (__assign(__assign({}, psw), { mdp: encrypt(psw.mdp, user._id.toHexString()), _id: new Types.ObjectId() })); });
        forDataBasePsws.forEach(function (psw) { return user.allPassw.push(psw); });
        user.save()
            .then(function () {
            return useReturn(res, "Correctly added ".concat(newpswList.length, " passwords"));
        })
            .catch(function (e) { return useError(res, e); });
    })
        .catch(function (e) { return useError(res, e); });
};
export var deleteAllPswAndCateg = function (req, res) {
    var userId = req.auth.userId;
    User.findById(userId)
        .then(function (user) {
        if (!user)
            useError(res, { err: 'Do not find user' });
        var resetedUser = user;
        resetedUser.allPassw = [];
        resetedUser.pswByCateg = [
            {
                _id: new Types.ObjectId(),
                name: 'SearchContent',
                passwords: [],
            },
        ];
        resetedUser
            .save()
            .then(function () {
            return useReturn(res, 'Passwords and category was succesfully deleted');
        })
            .catch(function (e) { return useError(res, e); });
    })
        .catch(function (e) { return useError(res, e); });
};
export var returnAllPswInCSV = function (req, res) {
    var userId = req.auth.userId;
    User.findById(userId)
        .then(function (user) {
        if (!user)
            useError(res, { err: 'Do not find user' });
        var now = new Date();
        var timeStr = "".concat(now.getHours().toString().padStart(2, '0'), "-").concat(now
            .getMinutes()
            .toString()
            .padStart(2, '0'), "-").concat(now
            .getSeconds()
            .toString()
            .padStart(2, '0'));
        var filePath = "./csvExport/passwords".concat(timeStr, ".csv");
        var csvWriter = createCsvWriter({
            path: filePath,
            header: [
                { id: 'mdp', title: 'MDP' },
                { id: 'email', title: 'EMAIL' },
                { id: 'siteLink', title: 'SITELINK' },
                { id: 'categName', title: 'CATEGNAME' },
            ],
        });
        var allPswForCSV = [];
        user.allPassw.forEach(function (passw) {
            allPswForCSV.push({
                mdp: decrypt(passw.mdp, user._id.toString()),
                email: passw.identifier,
                siteLink: passw.siteAddress,
                categName: passw.categName,
            });
        });
        csvWriter
            .writeRecords(allPswForCSV)
            .then(function () {
            res.download(filePath, function (err) {
                if (err) {
                    useError(res, { err: 'Error when send file' });
                }
            });
        })
            .catch(function (e) { return useError(res, e); });
    })
        .catch(function (e) { return useError(res, e); });
};
