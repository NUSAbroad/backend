import { BadRequest } from 'http-errors';
import { Transaction } from 'sequelize/types';
import { Country } from '../models';

async function fetchCountryId(countryName: string, t: Transaction) {
  const country = await Country.findOne({
    where: {
      name: countryName
    },
    transaction: t
  });

  if (!country) throw new BadRequest(`${countryName} Country dosen't exist!`);

  return country.id;
}

export { fetchCountryId };
