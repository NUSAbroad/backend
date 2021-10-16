import { ModuleCreationAttributes } from '../models/Module';
import { FacultyCreationAttributes } from '../models/Faculty';
import { Faculty } from '../models';
import { ModuleFormattedInfo } from './modules';
import { Transaction } from 'sequelize/types';
import { BadRequest } from 'http-errors';
import { PARTNER_UNIVERSITY_TYPE } from '../consts/faculty';

type AcronymMapper = {
  [key: string]: string;
};

// Known mappings names
const facultiesAcronym: AcronymMapper = {
  'Faculty of Arts & Social Sci': 'FASS', // Edurec
  'Arts and Social Science': 'FASS', // NUS Mods
  'NUS Business School': 'BIZ',
  Computing: 'SoC', // NUS Mods
  'School of Computing': 'SoC', // Edurec
  'Design and Environment': 'SDE', // NUS Mods
  'School of Design & Environment': 'SDE', // Edurec
  Engineering: 'FoE', // NUS Mods
  'Faculty of Engineering': 'FoE', // Edurec
  Science: 'FoS', // NUS Mods
  'Faculty of Science': 'FoS', // Edurec
  NUS: 'NUS'
};

function getFacultyAcronym(faculty: string) {
  if (facultiesAcronym[faculty.trim()]) return facultiesAcronym[faculty.trim()];

  return faculty;
}

async function getFacultyId(name: string, t: Transaction) {
  const faculty = await Faculty.findOne({
    where: {
      name
    },
    transaction: t
  });

  if (!faculty) throw new BadRequest(`Unable to find faculty ${name}`);

  return faculty!.id;
}

async function getFacultyIds(modulesInfo: ModuleFormattedInfo[], t: Transaction) {
  return await Promise.all(
    modulesInfo.map(async (moduleInfo: ModuleFormattedInfo) => {
      const facultyId = await getFacultyId(moduleInfo.faculty, t);

      return {
        ...moduleInfo,
        facultyId
      } as ModuleCreationAttributes;
    })
  );
}

async function createRelatedFaculties(faculties: string, universityId: number, t: Transaction) {
  const facultiesArr = faculties.split(',');

  const facultiesCreationAttribute: FacultyCreationAttributes[] = [];

  facultiesArr.forEach((faculty: string) => {
    if (faculty && faculty.trim()) {
      const facultyCreationAttribute: FacultyCreationAttributes = {
        name: faculty.trim(),
        type: PARTNER_UNIVERSITY_TYPE,
        universityId
      };
      facultiesCreationAttribute.push(facultyCreationAttribute);
    }
  });

  const createdFaculties = await Faculty.bulkCreate(facultiesCreationAttribute, {
    ignoreDuplicates: true,
    transaction: t
  });

  return createdFaculties;
}

export { getFacultyAcronym, getFacultyIds, createRelatedFaculties };
