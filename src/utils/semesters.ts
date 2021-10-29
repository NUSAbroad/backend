import { SemesterCreationAttributes } from '../models/Semester';
import { Transaction } from 'sequelize/types';
import { Semester } from '../models';
import { LINE_BREAK_REGEX } from '../consts';

async function createRelatedSemesters(semesters: string, universityId: number, t: Transaction) {
  if (!semesters) return;

  const semestersArr = semesters.split(',');

  const semestersCreationAttribute: SemesterCreationAttributes[] = [];

  semestersArr.forEach((semesterStr: string) => {
    if (semesterStr && semesterStr.trim() && semesterStr.trim().replace(LINE_BREAK_REGEX, '')) {
      const semesterCreationAttribute: SemesterCreationAttributes = {
        description: semesterStr.trim().replace(LINE_BREAK_REGEX, ''),
        universityId
      };
      semestersCreationAttribute.push(semesterCreationAttribute);
    }
  });

  const createdSemesters = await Semester.bulkCreate(semestersCreationAttribute, {
    ignoreDuplicates: true,
    transaction: t
  });

  return createdSemesters;
}

export { createRelatedSemesters };
