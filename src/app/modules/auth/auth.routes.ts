import { Router } from 'express';
import { AuthController } from './auth.controller';
import clientInfoParser from '../../middleware/clientInfoParser';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.interface';
import validateRequest from '../../middleware/validateRequest';
import { AuthValidation } from './auth.validation';

const router = Router();

router.post('/login', clientInfoParser, AuthController.loginUser);

router.post(
   '/refresh-token',
   // validateRequest(AuthValidation.refreshTokenZodSchema),
   AuthController.refreshToken
);

router.post(
   '/change-password',
   auth(UserRole.ADMIN, UserRole.USER),
   AuthController.changePassword
);

router.post('/forgot-password', AuthController.forgotPassword);
router.post('/verify-otp', AuthController.verifyOTP);
router.post('/reset-password', AuthController.resetPassword);

export const AuthRoutes = router;
