import exp from 'express';
import { Types } from 'mongoose';
import axios from 'axios';

import { User, IPassw, ICateg } from '../models/model_user.js';
import { encrypt, useError, useReturn } from '../middleware/func.js';
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
            console.log(newPswWithId);
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

    function replaceGoodPsw(listOfPsw: IPassw[], userID: string) {
        const editedCrypt = {
            ...editedPsw,
            mdp: encrypt(editedPsw.mdp, userID),
        };
        return listOfPsw.map((passw) => {
            if (passw._id.equals(new Types.ObjectId(editedPsw._id))) {
                return editedCrypt;
            }
            return passw;
        });
    }

    User.findById(req.auth.userId)
        .then((user) => {
            if (!user) {
                useError(res, { err: 'Password not found' }, 404);
            }
            const editedUser = user;
            editedUser.allPassw = replaceGoodPsw(
                editedUser.allPassw,
                user._id.toHexString()
            );
            if (editedPsw.categName) {
                editedUser.pswByCateg = editedUser.pswByCateg.map((categ) => {
                    if (categ.name === editedPsw.categName) {
                        return {
                            ...categ,
                            passwords: replaceGoodPsw(
                                categ.passwords,
                                user._id.toHexString()
                            ),
                        } as ICateg;
                    }
                    return categ;
                });
            }
            editedUser
                .save()
                .then(() => useReturn(res, 'Password succesfully edited'))
                .catch((e) => useError(res, e));
        })
        .catch((e) => useError(res, e));
};
