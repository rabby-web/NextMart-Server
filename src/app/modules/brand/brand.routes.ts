import { Router } from 'express';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middleware/bodyParser';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.interface';
import validateRequest from '../../middleware/validateRequest';
import { BrandController } from './brand.controller';

const router = Router();

router.get("/", BrandController.getAllBrand)

router.post(
    '/',
    auth(UserRole.ADMIN, UserRole.USER),
    multerUpload.single('logo'),
    parseBody,
    BrandController.createBrand
);

router.patch(
    '/:id',
    auth(UserRole.ADMIN, UserRole.USER),
    multerUpload.single('logo'),
    parseBody,
    BrandController.updateBrand
)

router.delete(
    '/:id',
    auth(UserRole.ADMIN, UserRole.USER),
    BrandController.deleteBrand
)

export const BrandRoutes = router;
