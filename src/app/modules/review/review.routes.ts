import { Router } from 'express';
import { ReviewControllers } from './review.controller';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.interface';

const router = Router();

router.get(
    '/',
    auth(UserRole.ADMIN),
    ReviewControllers.getAllReviews
);
router.post(
    '/',
    auth(UserRole.USER),
    ReviewControllers.createReview
);

export const ReviewRoutes = router;
