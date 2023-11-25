/* eslint-disable @typescript-eslint/no-unused-vars */
//* IMPORTS
import express from 'express';
import pkg from 'mongoose';
import cookieParser from 'cookie-parser';
import router from './routes.js';
import logger from './middleware/log.js';
import serveur from './server.js';
var connect = pkg.connect;
//* INIT APP
var app = express();
//* CORS
app.use(function (req, res, next) {
    var allowedOrigins = ['http://localhost:5173'];
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // ?Pour permettre les cookies
    next();
});
//* CONNEXION MONGODB
var connectWithRetry = function (url, maxRetries) {
    if (maxRetries === void 0) { maxRetries = 10; }
    connect(url)
        .then(function () {
        logger.info('MongoDB est connecté');
        console.log('Serveur correctement lancé');
    })
        .catch(function (err) {
        logger.error('Erreur de connexion à MongoDB:', err);
        if (maxRetries > 0) {
            setTimeout(function () { return connectWithRetry(url, maxRetries - 1); }, 5000); // Réessayer après 5 secondes
        }
        else if (maxRetries === 0) {
            console.log('Serveur arrêté');
            serveur.close(function () { return logger.error('Serveur arrêté'); });
        }
    });
};
connectWithRetry('mongodb+srv://sam:zaXMBRLuasccCUKv@cluster0.wpyzmou.mongodb.net/passworld');
//* ALLOW ACCES TO DATA IN .JSON
app.use(express.json()); // ? for application/json
app.use(cookieParser());
//* SEND REQUEST TO ROUTER
app.use('', router);
export default app;
