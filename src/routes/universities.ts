import { Router } from 'express';
import * as universityController from '../controllers/universityController';

const router = Router();

router.get('/', universityController.indexUniversityFuncs);
router.get('/:id', universityController.showUniversityFuncs);
router.post('/', universityController.createUniversityFuncs);
router.post('/import', universityController.importUniversityFuncs);
router.post('/reset', universityController.resetUniversityFuncs);
router.put('/:id', universityController.updateUniversityFuncs);
router.delete('/:id', universityController.destroyUniversityFuncs);

export default router;
