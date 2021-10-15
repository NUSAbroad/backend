import { Router } from 'express';
import * as linkController from '../controllers/linkController';

const router = Router();

router.get('/', linkController.indexLinkFuncs);
router.get('/:id', linkController.showLinkFuncs);
router.post('/', linkController.createLinkFuncs);
router.post('/scrape', linkController.scrapeGROLinksFuncs);
router.put('/:id', linkController.updateLinkFuncs);
router.delete('/:id', linkController.destroyLinkFuncs);

export default router;
