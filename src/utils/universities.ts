import { University } from '../models';
import slug from 'slug';
import { UniversityCreationAttributes } from '../models/University';
import { fetchCountryId } from '../utils/countries';
import { Transaction } from 'sequelize/types';

interface UniversityRow {
  name: string;
  country: string;
  state?: string;
  slug?: string;
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
      console.log(countryId);

      const universityCreationAttributes: UniversityCreationAttributes = {
        name: university.name,
        slug: university.slug!,
        state: university.state || null,
        additionalInfo: null,
        countryId
      };

      return universityCreationAttributes;
    })
  );
}

export {
  UniversityRow,
  formatUniversity,
  formatUniversities,
  addSlugToUniversityRow,
  addCountryIds
};
