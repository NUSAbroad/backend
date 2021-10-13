import { Router } from 'express';
import * as universityController from '../controllers/universityController';

const router = Router();

router.get('/', universityController.indexUniversityFuncs);
router.get('/:slug', universityController.showUniversityFuncs);
router.post('/', universityController.createUniversityFuncs);
router.post('/import', universityController.importUniversityFuncs);
router.post('/reset', universityController.resetUniversityFuncs);
router.put('/:slug', universityController.updateUniversityFuncs);
router.delete('/:slug', universityController.destroyUniversityFuncs);

export default router;
