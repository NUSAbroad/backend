import { Router } from 'express';
import * as universityController from '../controllers/universityController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', universityController.indexUniversityFuncs);
router.get('/:slug', universityController.showUniversityFuncs);
router.post('/', auth, universityController.createUniversityFuncs);
router.post('/import', auth, universityController.importUniversityFuncs);
router.post('/reset', auth, universityController.resetUniversityFuncs);
router.put('/:slug', auth, universityController.updateUniversityFuncs);
router.delete('/:slug', auth, universityController.destroyUniversityFuncs);

export default router;
