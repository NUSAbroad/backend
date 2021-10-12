import { ModuleCreationAttributes } from '../models/Module';

interface ModuleInfo {
  moduleCode: string;
  faculty: string;
  title: string;
  moduleCredit: string;
}

function formatModules(modulesInfo: ModuleInfo[], nusId: number) {
  console.log(typeof modulesInfo);
  return modulesInfo.map((moduleInfo: ModuleInfo) => {
    const { moduleCode, title, moduleCredit, faculty } = moduleInfo;

    const moduleAttribute: ModuleCreationAttributes = {
      faculty,
      code: moduleCode,
      name: title,
      credits: +moduleCredit,
      universityId: nusId
    };

    return moduleAttribute;
  });
}

export { ModuleInfo, formatModules };
