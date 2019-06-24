import express from 'express';
import AuthController from '../controllers/AuthController';
import loginMiddleware from '../middleware/loginMiddleware';
import refreshTokenMiddleware from '../middleware/refreshTokenMiddleware.1';
import passport from 'passport';
import socketMiddleware from '../middleware/socketMiddleware';

const router = express.Router();
const authController = new AuthController();

router.post('/signin', loginMiddleware, authController.signin);
router.post('/signup', authController.signup);
router.post('/refresh-token', refreshTokenMiddleware, authController.refreshToken);
router.get('/google', socketMiddleware, passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
  authController.oauthSignin
);

export default router;
