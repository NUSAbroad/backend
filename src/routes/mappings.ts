import { Router } from 'express';
import * as mappingController from '../controllers/mappingController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', mappingController.indexMappingFuncs);
router.get('/:id', mappingController.showMappingFuncs);
router.post('/', auth, mappingController.createMappingFuncs);
router.post('/import', auth, mappingController.importMappingFuncs);
router.post('/reset', auth, mappingController.resetMappingFuncs);
router.put('/:id', auth, mappingController.updateMappingFuncs);
router.delete('/:id', auth, mappingController.destroyMappingFuncs);

export default router;
