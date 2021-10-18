import { Router } from 'express';
import * as facultyController from '../controllers/facultyController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', facultyController.indexFacultyFuncs);
router.get('/:id', facultyController.showFacultyFuncs);
router.post('/', auth, facultyController.createFacultyFuncs);
router.put('/:id', auth, facultyController.updateFacultyFuncs);
router.delete('/:id', auth, facultyController.destroyFacultyFuncs);

export default router;
