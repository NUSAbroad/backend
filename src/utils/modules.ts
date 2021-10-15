interface ModuleInfo {
  moduleCode: string;
  faculty: string;
  title: string;
  moduleCredit: string;
}

interface ModuleFormattedInfo {
  code: string;
  faculty: string;
  credits: number;
  name: string;
  universityId: number;
}

function formatModules(modulesInfo: ModuleInfo[], nusId: number) {
  console.log(typeof modulesInfo);
  return modulesInfo.map((moduleInfo: ModuleInfo) => {
    const { moduleCode, title, moduleCredit, faculty } = moduleInfo;

    const moduleAttribute: ModuleFormattedInfo = {
      faculty,
      code: moduleCode,
      name: title,
      credits: +moduleCredit,
      universityId: nusId
    };

    return moduleAttribute;
  });
}

export { ModuleInfo, formatModules, ModuleFormattedInfo };
