import exp from 'express';
import { Types } from 'mongoose';
import axios from 'axios';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

import { User, IPassw, ICateg } from '../models/model_user.js';
import { decrypt, encrypt, useError, useReturn } from '../middleware/func.js';
import logger from '../middleware/log.js';

export const addPassword = (req: exp.Request, res: exp.Response) => {
    async function fetchIco(url: string) {
        try {
            let link = url;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                link = `http://${url}`;
            }
            const urlObj = new URL(link);
            let withoutPref = urlObj.hostname;
            if (withoutPref.startsWith('www.')) {
                withoutPref = withoutPref.slice(4);
            }
            const icoUrl = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.${withoutPref}&size=50`;
            const response = await axios.get(icoUrl, {
                responseType: 'arraybuffer',
            });
            const base64 = btoa(
                new Uint8Array(response.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                )
            );
            return `data:image/png;base64,${base64}`;
        } catch (error) {
            logger.error("Erreur lors de la récupération de l'image");
            return null;
        }
    }

    const { newPsw }: { newPsw: IPassw } = req.body;
    User.findById(req.auth.userId)
        // eslint-disable-next-line consistent-return
        .then(async (user) => {
            if (!user) useError(res, { err: "User don't found" });
            const newPswSimple = newPsw?.toObject ? newPsw.toObject() : newPsw;
            const mdp = encrypt(newPswSimple.mdp, user._id.toHexString());
            let newPswWithId = {
                ...newPswSimple,
                _id: new Types.ObjectId(),
                mdp,
            };
            try {
                const icoSrc = await fetchIco(newPswSimple.siteAddress);
                if (icoSrc && icoSrc.startsWith('data:image/png;base64')) {
                    newPswWithId = {
                        ...newPswWithId,
                        icoLink: icoSrc,
                    };
                }
            } catch (error) {
                logger.error('Error when trying to get the icon:', error);
            }
            if (newPswWithId?.categName) {
                user.pswByCateg.forEach((categ) => {
                    if (categ.name === newPsw?.categName) {
                        categ.passwords.push(newPswWithId);
                    }
                });
            }
            user.allPassw.push(newPswWithId);
            user.save()
                .then(() =>
                    useReturn(res, `Password succesfully added`, 200, {
                        pswId: newPswWithId._id,
                    })
                )
                .catch((e) => useError(res, e));
        })
        .catch((e) => useError(res, e));
};

export const deletePassword = (req: exp.Request, res: exp.Response) => {
    const { pswId, categName } = req.body;
    User.findById(req.auth.userId)
        .then((user) => {
            if (!user) {
                useError(res, { err: 'Password not found' }, 404);
            }
            const deletedPsw = user.allPassw.find(
                (psw) => psw._id.toString() === pswId
            );

            // Supprime le mpd
            const pswLess = user;
            pswLess.allPassw = pswLess.allPassw.filter(
                (psw) => !psw._id.equals(new Types.ObjectId(pswId))
            );
            pswLess.pswByCateg = pswLess.pswByCateg.map((categ) => {
                if (categ.name === categName) {
                    const filteredPasswords = categ.passwords.filter(
                        (psw) => !psw._id.equals(new Types.ObjectId(pswId))
                    );
                    return {
                        ...categ,
                        passwords: filteredPasswords,
                    } as ICateg;
                }
                return categ;
            });

            pswLess
                .save()
                .then(() => {
                    useReturn(res, 'Password succesfully deleted', 200, {
                        deletedPsw,
                    });
                })
                .catch((e) => useError(res, e));
        })
        .catch((e) => useError(res, e));
};

export const replaceAPsw = (req: exp.Request, res: exp.Response) => {
    const { editedPsw } = req.body;
    const cryptEditPsw: IPassw = {
        ...editedPsw,
        mdp: encrypt(editedPsw.mdp, req.auth.userId),
    };
    User.findById(req.auth.userId)
        .then((user) => {
            if (!user) {
                useError(res, { err: 'Password not found' }, 404);
            }
            const editedUser = user;
            const oldPsw = editedUser.allPassw.find(
                (psw) => psw._id.toHexString() === editedPsw._id
            );
            editedUser.allPassw = editedUser.allPassw.map((psw) => {
                if (psw._id.toHexString() === editedPsw._id)
                    return cryptEditPsw;
                return psw;
            });

            editedUser.pswByCateg = editedUser.pswByCateg.map((categ) => {
                // ? on retire le mot de passe de son ancienne categ
                if (
                    categ.name === oldPsw.categName &&
                    categ.name !== cryptEditPsw.categName
                ) {
                    const passwords = categ.passwords.filter(
                        (psw) =>
                            !psw._id.equals(new Types.ObjectId(editedPsw._id))
                    );
                    return {
                        ...categ,
                        passwords,
                    };
                }
                // ? on ajoute le mot de passe dans sa nouvelle categ
                if (categ.name === cryptEditPsw.categName) {
                    const updatedPsws = categ.passwords;
                    updatedPsws.push(cryptEditPsw);
                    return {
                        ...categ,
                        passwords: updatedPsws,
                    };
                }
                return categ;
            }) as ICateg[];
            editedUser
                .save()
                .then(() => useReturn(res, 'Password succesfully edited'))
                .catch((e) => useError(res, e));
        })
        .catch((e) => useError(res, e));
};

export const addMultiplePsw = (req: exp.Request, res: exp.Response) => {
    const { newpswList }: { newpswList: IPassw[] } = req.body;
    User.findByIdAndUpdate(
        req.auth.userId,
        { $push: { allPsw: { $each: newpswList } } },
        { new: true, safe: true, upsert: false }
    )
        .then((user) => {
            if (!user) useError(res, { err: 'Do not find user' });
            else
                useReturn(
                    res,
                    `Correctly added ${newpswList.length} passwords`
                );
        })
        .catch((e) => useError(res, e));
};

export const deleteAllPswAndCateg = (req: exp.Request, res: exp.Response) => {
    const { userId } = req.auth;
    User.findById(userId)
        .then((user) => {
            if (!user) useError(res, { err: 'Do not find user' });
            const resetedUser = user;
            resetedUser.allPassw = [];
            resetedUser.pswByCateg = [
                {
                    _id: new Types.ObjectId(),
                    name: 'SearchContent',
                    passwords: [],
                },
            ] as ICateg[];
            resetedUser
                .save()
                .then(() =>
                    useReturn(
                        res,
                        'Passwords and category was succesfully deleted'
                    )
                )
                .catch((e) => useError(res, e));
        })
        .catch((e) => useError(res, e));
};

export const returnAllPswInCSV = (req: exp.Request, res: exp.Response) => {
    const { userId } = req.auth;
    User.findById(userId)
        .then((user) => {
            if (!user) useError(res, { err: 'Do not find user' });
            const csvWriter = createCsvWriter({
                path: '../../csvExport/passwords.csv',
                header: [
                    { id: 'mdp', title: 'MDP' },
                    { id: 'email', title: 'EMAIL' },
                    { id: 'siteLink', title: 'SITELINK' },
                    { id: 'categName', title: 'CATEGNAME' },
                ],
            });
            const allPswForCSV = [];
            user.allPassw.forEach((passw) => {
                allPswForCSV.push({
                    mdp: decrypt(passw.mdp, user._id.toString()),
                    email: passw.identifier,
                    siteLink: passw.siteAddress,
                    categName: passw.categName,
                });
            });
            csvWriter
                .writeRecords(allPswForCSV)
                .then(() => {
                    res.download('../../csvExport/passwords.csv');
                })
                .catch((e) => useError(res, e));
        })
        .catch((e) => useError(res, e));
};
