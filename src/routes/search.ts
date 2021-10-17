import { Router } from 'express';
import * as searchController from '../controllers/searchController';

const router = Router();

router.get('/general', searchController.searchFuncs);
router.get('/general/:query', searchController.searchFuncs);
router.get('/faculty/', searchController.searchFacultiesFuncs);
router.get('/faculty/:query', searchController.searchFacultiesFuncs);
router.get('/moduleName', searchController.searchModuleNameFuncs);
router.get('/moduleName/:query', searchController.searchModuleNameFuncs);
router.get('/moduleCode', searchController.searchModuleCodeFuncs);
router.get('/moduleCode/:query', searchController.searchModuleCodeFuncs);

export default router;
