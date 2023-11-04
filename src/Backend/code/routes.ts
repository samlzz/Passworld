import express from 'express';
import { checkIdAndCreate } from './controllers/user';

const router = express.Router();

//* USER
router.get('/register', checkIdAndCreate); //! need : username, password
router.post('/login', () => {}); //! need : data_name, password

export default router;
