import { Router } from 'express';
import * as semesterController from '../controllers/semesterController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', semesterController.indexSemesterFuncs);
router.get('/:id', semesterController.showSemesterFuncs);
router.post('/', auth, semesterController.createSemesterFuncs);
router.put('/:id', auth, semesterController.updateSemesterFuncs);
router.delete('/:id', auth, semesterController.destroySemesterFuncs);

export default router;
