import axios from 'axios';
import cheerio from 'cheerio';
import slug from 'slug';

import { University } from '../models';
import { LinkCreationAttributes } from '../models/Link';

const baseUrl = 'https://nus.edu.sg';
const url = 'https://www.nus.edu.sg/gro/global-programmes/student-exchange/partner-universities';
const groPDF = 'GRO PDF';

async function scrapeData() {
  // Fetch HTML of the page we want to scrape
  const { data } = await axios.get(url);
  // Load HTML we fetched in the previous line
  const $ = cheerio.load(data);
  // console.log(pretty($.html()));

  // Select all the list items under accordion-list element
  const links: LinkCreationAttributes[] = [];

  const listItems = $('.accordion-list>div>div>div>ul>li>a');

  await Promise.all(
    listItems.map(async (idx, el) => {
      const universityName = $(el).text().trim();

      let pdfLink = $(el).attr('href') ? $(el).attr('href')!.trim() : '';

      const universitySlug = slug(universityName);

      const university = await University.findOne({
        where: {
          slug: universitySlug
        }
      });

      if (university) {
        if (!pdfLink.startsWith('https')) pdfLink = baseUrl + pdfLink;

        const link = {
          name: groPDF,
          link: pdfLink,
          universityId: university.id
        };

        links.push(link);
      } else {
        console.log('No hit!', universityName, universitySlug);
      }
    })
  );

  return links;
}

export { scrapeData };
