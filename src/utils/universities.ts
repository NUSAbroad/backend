import { University } from '../models';
import slug from 'slug';
import { UniversityCreationAttributes } from '../models/University';
import { fetchCountryId } from '../utils/countries';
import { Transaction } from 'sequelize/types';
import { BadRequest } from 'http-errors';
import { createRelatedLinks } from './links';
import { createRelatedFaculties } from './faculties';
import { createRelatedSemesters } from './semesters';

type additionalInfo = {
  [key: string]: string;
};

interface UniversityRow {
  name: string;
  country: string;
  state?: string;
  slug: string;
  additionalInfo?: string | additionalInfo;
  faculties: string;
  semesters: string;
  links: string;
}

function buildAdditionalInfo(additionalInfo: string) {
  const keyValuePairs = additionalInfo.split('\n');
  const result: additionalInfo = {};

  keyValuePairs.map((keyValuePair: string) => {
    const [key, value] = keyValuePair.split(':');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (key.trim() && value.trim()) {
      result[key.trim()] = value.trim();
    }
  });

  return result;
}

function cleanUniversityRow(row: UniversityRow) {
  // Remove if blank line
  if (!row.state) {
    delete row['state'];
  } else {
    row.state = row.state.trim();
  }

  // Remove if blank line
  if (!row.additionalInfo) {
    delete row['additionalInfo'];
  } else {
    const additionalInfo = buildAdditionalInfo(row.additionalInfo as string);
    row.additionalInfo = additionalInfo;
  }

  return row;
}

function addSlugToUniversityRow(row: UniversityRow) {
  return {
    ...row,
    slug: slug(row.name)
  };
}

async function formatUniversity(university: University) {
  const mappings = await university.getMappings();
  const mappingsCount = mappings.length;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedUniversity: any = university.toJSON();
  formattedUniversity['mappingsCount'] = mappingsCount;

  return formattedUniversity;
}

async function formatUniversities(universities: University[]) {
  const formattedUniversities = await Promise.all(
    universities.map(async (university: University) => {
      return await formatUniversity(university);
    })
  );

  return formattedUniversities;
}

async function addCountryIds(universities: UniversityRow[], t: Transaction) {
  return await Promise.all(
    universities.map(async (university: UniversityRow) => {
      const countryId = await fetchCountryId(university.country, t);

      const universityCreationAttributes: UniversityCreationAttributes = {
        name: university.name,
        slug: university.slug!,
        state: university.state || null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        additionalInfo: (university.additionalInfo as any) || null,
        countryId
      };

      return universityCreationAttributes;
    })
  );
}

async function bulkCreateRelatedInfo(universities: UniversityRow[], t: Transaction) {
  await Promise.all(
    universities.map(async (universityRow: UniversityRow) => {
      // console.log(universityRow.slug);
      const university = await University.findOne({
        where: {
          slug: universityRow.slug
        },
        transaction: t
      });

      if (!university) {
        console.log(universityRow);
        throw new BadRequest('No university found!');
      }

      await Promise.all([
        await createRelatedLinks(universityRow.links, university.id, t),
        await createRelatedSemesters(universityRow.semesters, university.id, t),
        await createRelatedFaculties(universityRow.faculties, university.id, t)
      ]);

      return university;
    })
  );
}

export {
  UniversityRow,
  formatUniversity,
  formatUniversities,
  addSlugToUniversityRow,
  addCountryIds,
  cleanUniversityRow,
  bulkCreateRelatedInfo
};
