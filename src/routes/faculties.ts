import { Router } from 'express';
import * as facultyController from '../controllers/facultyController';

const router = Router();

router.get('/', facultyController.indexFacultyFuncs);
router.get('/:id', facultyController.showFacultyFuncs);
router.post('/', facultyController.createFacultyFuncs);
router.put('/:id', facultyController.updateFacultyFuncs);
router.delete('/:id', facultyController.destroyFacultyFuncs);

export default router;
