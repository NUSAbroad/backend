import { Router } from 'express';
import * as universityController from '../controllers/universityController';

const router = Router();

router.get('/', universityController.indexUniversityFuncs);
router.get('/:id', universityController.showUniversityFuncs);
router.post('/', universityController.createUniversityFuncs);
router.put('/:id', universityController.updateUniversityFuncs);
router.delete('/:id', universityController.destroyUniversityFuncs);
router.post('/import', universityController.importUniversityFuncs);

export default router;
