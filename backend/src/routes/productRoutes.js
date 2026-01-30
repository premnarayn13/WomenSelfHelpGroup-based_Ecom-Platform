import express from 'express';
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProductById,
    addReview,
    getSHGProducts,
    upload,
} from '../controllers/productController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('shg'), upload.array('images', 5), createProduct);
router.put('/:id', protect, authorize('shg'), upload.array('images', 5), updateProduct);
router.delete('/:id', protect, authorize('shg'), deleteProduct);
router.get('/', getProducts);
router.get('/shg/:shgId', getSHGProducts);
router.get('/:id', getProductById);
router.post('/:id/review', protect, authorize('customer'), addReview);

export default router;
