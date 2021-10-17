import { Router } from 'express';
import * as linkController from '../controllers/linkController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', linkController.indexLinkFuncs);
router.get('/:id', linkController.showLinkFuncs);
router.post('/', auth, linkController.createLinkFuncs);
router.post('/scrape', auth, linkController.scrapeGROLinksFuncs);
router.post('/reset', auth, linkController.resetLinksFuncs);
router.put('/:id', auth, linkController.updateLinkFuncs);
router.delete('/:id', auth, linkController.destroyLinkFuncs);

export default router;
