//* IMPORTS
import express, { Express } from 'express';
import pkg from 'mongoose';
import cookieParser from 'cookie-parser';
import router from './routes.js';

const { connect, connection } = pkg;

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
app.use(cookieParser());

//* SEND REQUEST TO ROUTER
app.use('', router);

//* TEST FOR DEV
// check connexion to database
app.get('/mongodb', (req, res, next) => {
    const DbIsCo = connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json(`MongoDB is ${DbIsCo}`);
    next();
});

export default app;
