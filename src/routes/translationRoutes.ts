import express from 'express';
import { getTranslation } from '../controllers/translationController';

const router = express.Router();

router.get('/:id', getTranslation);

export default router;
