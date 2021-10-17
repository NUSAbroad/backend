import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

router.post('/login', userController.loginFuncs);
router.post('/register', userController.registerFuncs);

export default router;
