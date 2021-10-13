import { Router } from 'express';
import * as moduleController from '../controllers/moduleController';

const router = Router();

router.get('/', moduleController.indexModuleFuncs);
router.get('/:id', moduleController.showModuleFuncs);
router.post('/', moduleController.createModuleFuncs);
router.post('/populate', moduleController.populateModuleFuncs);
router.post('/reset', moduleController.resetModuleFuncs);
router.put('/:id', moduleController.updateModuleFuncs);
router.delete('/:id', moduleController.destroyModuleFuncs);

export default router;
