import express from 'express';

import {
    checkIdAndCreate,
    checkIdAndMdp,
    deleteCookies,
} from './controllers/user.js';
import { returnForSetting, returnPasswList } from './controllers/home.js';
import {
    addMultiplePsw,
    addPassword,
    deletePassword,
    replaceAPsw,
} from './controllers/password.js';
import { addCategory, deleteCategory } from './controllers/categ.js';
import { authentified } from './middleware/auth.js';

const router = express.Router();

//* USER
router.post('/register', checkIdAndCreate); //! need : email, mdp  --> cookie(userId, token)
router.post('/login', checkIdAndMdp); //! need : email, mdp  --> cookie(userId, token)

//* AUTH (need userId and token in cookie)

router.delete('/resetCookies', authentified, deleteCookies);
router.get('/home', authentified, returnPasswList); //! --> allPassw, categPassw
router.get('/setting', authentified, returnForSetting); //! --> identifier, nbOfPassw

// ? For password Request
router.post('/addPsw', authentified, addPassword); //! need: newPassw  --> pswId
router.post('/delPsw', authentified, deletePassword); //! need: pswId, categName  --> deletedPsw
router.put('/editPsw', authentified, replaceAPsw); //! need: editedPsw
router.post('/addMultPsw', authentified, addMultiplePsw);

// ? For category Request
router.post('/addCateg', authentified, addCategory); //! need: categName  --> addedCateg (:_id)
router.post('/delCateg', authentified, deleteCategory); //! need: categId

export default router;
