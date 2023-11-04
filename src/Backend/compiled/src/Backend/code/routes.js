import express from 'express';
import { User } from './models/user.js';
var router = express.Router();
//* USER
router.get('/register', function (req, res, next) {
    var user = new User({
        email: 'sliziard@test.com',
        password: 'mdpdetest',
    });
    user.save()
        .then(function () { return res.status(201).json({ msg: 'Utilisateur créé !' }); })
        .catch(function (error) { return res.status(400).json({ error: error }); });
    next();
}); //! need : username, password
router.post('/login', function () { }); //! need : data_name, password
export default router;
