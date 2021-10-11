import { Router } from 'express';
import * as mappingController from '../controllers/mappingController';

const router = Router();

router.get('/', mappingController.indexMappingFuncs);
router.get('/:id', mappingController.showMappingFuncs);
router.post('/', mappingController.createMappingFuncs);
router.put('/:id', mappingController.updateMappingFuncs);
router.delete('/:id', mappingController.destroyMappingFuncs);

export default router;
