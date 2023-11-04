//* IMPORTS
import express, { Express } from 'express';
import { connect } from 'mongoose';
import router from './routes.js';

//* INIT APP
const app: Express = express();

//* CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // TODO: remplacer 'x' par l'adresse du frontend (ex:'https://cloudix.netlify.app')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    next();
});
//* CONNEXION MONGODB

connect(
    'mongodb+srv://sam:zaXMBRLuasccCUKv@cluster0.wpyzmou.mongodb.net/passworld'
)
    .then(() => {
        console.log('MongoDB are on');
    })
    .catch(() => {
        console.log('MongoDB are off');
    });

//* ALLOW ACCES TO DATA IN .JSON
app.use(express.json()); // ? for application/json

//* SEND REQUEST TO ROUTER
app.use('', router);

//* TEST FOR DEV

export default app;
