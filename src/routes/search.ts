import { Router } from 'express';
import * as searchController from '../controllers/searchController';

const router = Router();

router.get('/general', searchController.searchAllFuncs);
router.get('/general/:query', searchController.searchFuncs);
router.get('/faculty', searchController.searchAllFacultiesFuncs);
router.get('/faculty/:query', searchController.searchFacultiesFuncs);
router.get('/moduleName', searchController.searchAllModuleNameFuncs);
router.get('/moduleName/:query', searchController.searchModuleNameFuncs);
router.get('/moduleCode', searchController.searchAllModuleCodeFuncs);
router.get('/moduleCode/:query', searchController.searchModuleCodeFuncs);

export default router;
