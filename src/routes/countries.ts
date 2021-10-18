import { Router } from 'express';
import * as countryController from '../controllers/countryController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', countryController.indexCountryFuncs);
router.get('/:id', countryController.showCountryFuncs);
router.post('/', auth, countryController.createCountryFuncs);
router.put('/:id', auth, countryController.updateCountryFuncs);
router.delete('/:id', auth, countryController.destroyCountryFuncs);

export default router;
