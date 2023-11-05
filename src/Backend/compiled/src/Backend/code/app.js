//* IMPORTS
import express from 'express';
import pkg from 'mongoose';
import router from './routes.js';
var connect = pkg.connect, connection = pkg.connection;
//* INIT APP
var app = express();
//* CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // TODO: remplacer 'x' par l'adresse du frontend (ex:'https://cloudix.netlify.app')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
//* CONNEXION MONGODB
connect('mongodb+srv://sam:zaXMBRLuasccCUKv@cluster0.wpyzmou.mongodb.net/passworld')
    .then(function () {
    console.log('MongoDB are on');
})
    .catch(function () {
    console.log('MongoDB are off');
});
//* ALLOW ACCES TO DATA IN .JSON
app.use(express.json()); // ? for application/json
//* SEND REQUEST TO ROUTER
app.use('', router);
//* TEST FOR DEV
// check connexion to database
app.get('/mongodb', function (req, res, next) {
    var DbIsCo = connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json("MongoDB is ".concat(DbIsCo));
    next();
});
export default app;
