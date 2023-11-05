import express from 'express';

import {
    checkIdAndCreate,
    checkIdAndMdp,
    deleteUser,
} from './controllers/user.js';
import { returnPasswList } from './controllers/home.js';
import {
    addPassword,
    deletePassword,
    replaceAPsw,
} from './controllers/password.js';
import { addCategory, deleteCategory } from './controllers/categ.js';
import { authentified } from './middleware/auth.js';

const router = express.Router();

//* USER
router.post('/register', checkIdAndCreate); //! need : email(id), mdp  --> id, token
router.post('/login', checkIdAndMdp); //! need : email(id), mdp  --> id, token
router.delete('/delUser', deleteUser); //! need: userId  --> deletedUser

//* AUTH (need id in url)
router.get('/home/:id', authentified, returnPasswList); //! --> allPassw, pswByCateg

router.post('/addPsw/:id', authentified, addPassword); //! need: newPassw  --> pswId
router.delete('/delPsw/:id', authentified, deletePassword); //! need: pswId, categName
router.put('/editPsw/:id', authentified, replaceAPsw); //! need: editedPsw

router.post('/addCateg/:id', authentified, addCategory); //! need: categName  --> categId
router.delete('/delCateg/:id', authentified, deleteCategory); //! need: categId

export default router;
