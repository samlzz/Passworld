import express from 'express';
import { checkIdAndCreate, checkIdAndMdp, checkMdp, deleteCookies, editUserEmailOrPsw, } from './controllers/user.js';
import { returnForSetting, returnPasswList } from './controllers/home.js';
import { addMultiplePsw, addPassword, deleteAllPswAndCateg, deletePassword, replaceAPsw, returnAllPswInCSV, } from './controllers/password.js';
import { addCategory, deleteCategory, moveACateg, } from './controllers/categ.js';
import { authentified } from './middleware/auth.js';
var router = express.Router();
//* USER
router.post('/register', checkIdAndCreate); //! need : email, mdp  --> cookie(userId, token)
router.post('/login', checkIdAndMdp); //! need : email, mdp  --> cookie(userId, token)
// router.post('/resetMdp', ...); //! need: email, newMdp
//* AUTH (need userId and token in cookie)
router.put('/editUser', authentified, editUserEmailOrPsw); //! need?: newEmail, newMdp, oldMdp
router.post('/verifMdp', authentified, checkMdp); //! need?: mdpToCheck
router.get('/setting', authentified, returnForSetting); //! --> identifier, nbOfPassw
router.delete('/resetCookies', authentified, deleteCookies);
router.get('/home', authentified, returnPasswList); //! --> allPassw, categPassw
// ? For password Request
router.post('/addPsw', authentified, addPassword); //! need: newPassw  --> pswId
router.post('/delPsw', authentified, deletePassword); //! need: pswId, categName  --> deletedPsw
router.put('/editPsw', authentified, replaceAPsw); //! need: editedPsw
router.post('/addMultPsw', authentified, addMultiplePsw); //! need: newpswList
router.get('/pswFile', authentified, returnAllPswInCSV); //! --> csvFile
router.delete('/resetUserData', authentified, deleteAllPswAndCateg);
// ? For category Request
router.post('/addCateg', authentified, addCategory); //! need: categName  --> addedCateg (:_id)
router.post('/delCateg', authentified, deleteCategory); //! need: categId
router.put('/moveCateg', authentified, moveACateg); //! indexOfCateg newIndex
export default router;
