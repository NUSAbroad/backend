import { Router } from 'express';
import * as semesterController from '../controllers/semesterController';

const router = Router();

router.get('/', semesterController.indexSemesterFuncs);
router.get('/:id', semesterController.showSemesterFuncs);
router.post('/', semesterController.createSemesterFuncs);
router.put('/:id', semesterController.updateSemesterFuncs);
router.delete('/:id', semesterController.destroySemesterFuncs);

export default router;
