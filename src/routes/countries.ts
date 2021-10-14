import { Router } from 'express';
import * as countryController from '../controllers/countryController';

const router = Router();

router.get('/', countryController.indexCountryFuncs);
router.get('/:id', countryController.showCountryFuncs);
router.post('/', countryController.createCountryFuncs);
router.put('/:id', countryController.updateCountryFuncs);
router.delete('/:id', countryController.destroyCountryFuncs);

export default router;
