import { Router } from 'express';
import * as moduleController from '../controllers/moduleController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', moduleController.indexModuleFuncs);
router.get('/:id', moduleController.showModuleFuncs);
router.post('/', auth, moduleController.createModuleFuncs);
router.post('/populate', auth, moduleController.populateModuleFuncs);
router.post('/reset', auth, moduleController.resetModuleFuncs);
router.put('/:id', auth, moduleController.updateModuleFuncs);
router.delete('/:id', auth, moduleController.destroyModuleFuncs);

export default router;
