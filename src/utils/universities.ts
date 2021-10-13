import { University } from '../models';
import slug from 'slug';

interface UniversityRow {
  name: string;
  country: string;
  state?: string;
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

export { UniversityRow, formatUniversity, formatUniversities, addSlugToUniversityRow };
