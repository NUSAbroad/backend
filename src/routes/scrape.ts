import { Router } from 'express';
import * as scrapeController from '../controllers/scrapeController';

const router = Router();

router.get('/', scrapeController.scrapePDFLinksFuncs);

export default router;
