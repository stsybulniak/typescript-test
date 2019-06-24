import express from 'express';
import requireAuthMiddleware from '../middleware/requireAuthMiddleware';
import UserController from '../controllers/UserController';
const router = express.Router();

const userController = new UserController();

router.get('/', requireAuthMiddleware, userController.getUsersList);

export default router;
