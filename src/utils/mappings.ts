import { MappingCreationAttributes } from '../models/Mapping';
import { University } from '../models';

interface MappingRow {
  Faculty: string;
  'Partner University': string;
  'PU Module 1': string;
  'PU Module 1 Title': string;
  'PU Mod1 Credits': number;
  'PU Module 2': string;
  'PU Module 2 Title': string;
  'PU Mod2 Credits': number;
  'NUS Module 1': string;
  'NUS Module 1 Title': string;
  'NUS Mod1 Credits': number;
  'NUS Module 2': string;
  'NUS Module 2 Title': string;
  'NUS Mod2 Credits': number;
  'Pre Approved?': string;
}

interface NUSModule {
  nusModuleName: string;
  nusModuleCode: string;
  nusModuleFaculty: string;
  nusModuleCredits: number;
}

interface PUModule {
  partnerModuleName: string;
  partnerModuleCode: string;
  partnerModuleCredits: number;
  partnerUniversityName: string;
}

interface MappingInfo {
  nusModules: NUSModule[];
  puModules: PUModule[];
}
function createMappingInfo(data: MappingRow): MappingInfo {
  const nusModules: NUSModule[] = [];
  const puModules: PUModule[] = [];

  const nusModule1: NUSModule = {
    nusModuleName: data['NUS Module 1 Title'],
    nusModuleCode: data['NUS Module 1'],
    nusModuleFaculty: data['Faculty'],
    nusModuleCredits: data['NUS Mod1 Credits']
  };

  nusModules.push(nusModule1);

  if (data['NUS Module 2']) {
    const nusModule2: NUSModule = {
      nusModuleName: data['NUS Module 2 Title'],
      nusModuleCode: data['NUS Module 2'],
      nusModuleFaculty: data['Faculty'],
      nusModuleCredits: data['NUS Mod2 Credits']
    };

    nusModules.push(nusModule2);
  }

  const partnerUniversityName = data['Partner University'];

  const puModule1: PUModule = {
    partnerModuleName: data['NUS Module 1 Title'],
    partnerModuleCode: data['NUS Module 1'],
    partnerModuleCredits: data['PU Mod1 Credits'],
    partnerUniversityName
  };

  puModules.push(puModule1);

  if (data['NUS Module 2']) {
    const puModule2: PUModule = {
      partnerModuleName: data['NUS Module 2 Title'],
      partnerModuleCode: data['NUS Module 2'],
      partnerUniversityName,
      partnerModuleCredits: data['PU Mod2 Credits']
    };
    puModules.push(puModule2);
  }

  const mappings: MappingInfo = {
    nusModules,
    puModules
  };

  return mappings;
}

async function generateMappings(mappingsInfo: MappingInfo[]) {
  const mappingAttributes: MappingCreationAttributes[] = [];

  await Promise.all(
    mappingsInfo.map(async (mappingInfo: MappingInfo) => {
      const firstPUModule: PUModule = mappingInfo.puModules[0];
      const partnerUniversityName = firstPUModule.partnerUniversityName;

      const partnerUniversity = await University.findOne({
        where: { name: partnerUniversityName }
      });

      if (partnerUniversity) {
        mappingInfo.nusModules.forEach((nusModule: NUSModule) => {
          mappingInfo.puModules.forEach((puModule: PUModule) => {
            const mappingCreationAttributes: MappingCreationAttributes = {
              ...nusModule,
              partnerModuleName: puModule.partnerModuleName,
              partnerModuleCredits: puModule.partnerModuleCredits,
              partnerModuleCode: puModule.partnerModuleCode,
              partnerUniversityId: partnerUniversity.id
            };

            mappingAttributes.push(mappingCreationAttributes);
          });
        });
      }
    })
  );

  return mappingAttributes;
}

export { createMappingInfo, generateMappings, MappingRow, NUSModule, PUModule, MappingInfo };
