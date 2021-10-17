import axios from 'axios';
import cheerio from 'cheerio';
import { Transaction } from 'sequelize/types';
import slug from 'slug';

import { University, Link } from '../models';
import { LinkCreationAttributes } from '../models/Link';

const baseUrl = 'https://nus.edu.sg';
const url = 'https://www.nus.edu.sg/gro/global-programmes/student-exchange/partner-universities';
const groPDF = 'GRO Infosheet';

async function scrapeData() {
  // Fetch HTML of the page we want to scrape
  const { data } = await axios.get(url);
  // Load HTML we fetched in the previous line
  const $ = cheerio.load(data);

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

async function createRelatedLinks(links: string, universityId: number, t: Transaction) {
  if (!links) return;

  const linksArr = links.split('\n');

  const linksCreationAttribute: LinkCreationAttributes[] = [];

  linksArr.forEach((linkStr: string) => {
    const [name, link] = linkStr.split(': ');

    if (name && link) {
      const linkCreationAttribute: LinkCreationAttributes = {
        name: name.trim(),
        link: link.trim(),
        universityId
      };
      linksCreationAttribute.push(linkCreationAttribute);
    }
  });

  const createdLinks = await Link.bulkCreate(linksCreationAttribute, {
    ignoreDuplicates: true,
    transaction: t
  });

  return createdLinks;
}

export { scrapeData, createRelatedLinks };
