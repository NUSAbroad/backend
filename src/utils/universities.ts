import { University } from '../models';

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

export { formatUniversity, formatUniversities };
