import { Router } from 'express';
import { CategoryController } from './category.controller';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middleware/bodyParser';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.interface';
import validateRequest from '../../middleware/validateRequest';
import { categoryValidation } from './category.validation';

const router = Router();

router.get("/", CategoryController.getAllCategory)

router.post(
    '/',
    auth(UserRole.ADMIN, UserRole.USER),
    multerUpload.single('icon'),
    parseBody,
    validateRequest(categoryValidation.createCategoryValidationSchema),
    CategoryController.createCategory
);

router.patch(
    '/:id',
    auth(UserRole.ADMIN, UserRole.USER),
    multerUpload.single('icon'),
    parseBody,
    validateRequest(categoryValidation.updateCategoryValidationSchema),
    CategoryController.updateCategory
)

router.delete(
    '/:id',
    auth(UserRole.ADMIN, UserRole.USER),
    CategoryController.deleteCategory
)

export const CategoryRoutes = router;
