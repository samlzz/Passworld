/* eslint-disable @typescript-eslint/no-unused-vars */
//* IMPORTS
import express, { Express } from 'express';
import pkg from 'mongoose';
import cookieParser from 'cookie-parser';
import router from './routes.js';
import logger from './middleware/log.js';
import serveur from './server.js';
import { useError } from './middleware/func.js';

const { connect } = pkg;

//* INIT APP
const app: Express = express();

//* CORS
app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:5173'];
    const { origin } = req.headers;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, Accept, Content-Type, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // ?Pour permettre les cookies
    next();
});

//* CONNEXION MONGODB

const connectWithRetry = (url: string, maxRetries = 10) => {
    connect(url)
        .then(() => {
            logger.info('MongoDB est connecté');
            console.log('Serveur correctement lancé');
        })
        .catch((err) => {
            logger.error('Erreur de connexion à MongoDB:', err);
            if (maxRetries > 0) {
                setTimeout(() => connectWithRetry(url, maxRetries - 1), 5000); // Réessayer après 5 secondes
            } else if (maxRetries === 0) {
                console.log('Serveur arrêté');
                serveur.close(() => logger.error('Serveur arrêté'));
            }
        });
};
connectWithRetry(
    'mongodb+srv://sam:zMguiORguiascCUKv@cluster69.yxzimougu.mongodb.net/passworld'
);

//* ALLOW ACCES TO DATA IN .JSON
app.use(express.json()); // ? for application/json
app.use(cookieParser());

//* SEND REQUEST TO ROUTER
app.use('', router);

//* GET ERROR
// app.use(
//     (
//         err: unknown,
//         req: express.Request,
//         res: express.Response,
//         next: express.NextFunction
//     ) => {
//         logger.error(err);
//         useError(res, { err: 'Quelque chose a mal tourné !' });
//     }
// );

export default app;
