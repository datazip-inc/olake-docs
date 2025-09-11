// Author data utility for blog structured data
export const authorData = {
  'priyansh': {
    name: 'Priyansh Khodiyar',
    title: 'Ex OLake Devrel',
    image_url: '/img/authors/priyansh.jpg',
    email: 'hello@olake.io',
    socials: { linkedin: 'zriyansh' }
  },
  'sandeep': {
    name: 'Sandeep Devarapalli',
    title: 'OLake Maintainer',
    image_url: '/img/authors/sandeep.jpg',
    email: 'hello@olake.io',
    socials: { linkedin: 'sandeepdevarapalli' }
  },
  'ankit': {
    name: 'Ankit Sharma',
    title: 'OLake Maintainer',
    image_url: '/img/authors/ankit.jpg',
    email: 'hello@olake.io',
    socials: { linkedin: 'hashcode-ankit' }
  },
  'shubham': {
    name: 'Shubham Satish Baldava',
    title: 'OLake Maintainer',
    image_url: '/img/authors/shubham.jpg',
    email: 'hello@olake.io',
    socials: { linkedin: 'shubham-baldava' }
  },
  'vaibhav': {
    name: 'Vaibhav Verma',
    title: 'OLake Maintainer',
    image_url: '/img/authors/vaibhav.jpg',
    email: 'hello@olake.io',
    socials: { linkedin: 'vaibhav-verma-iiitr' }
  },
  'vikash': {
    name: 'Vikash Choudhary',
    title: 'OLake Maintainer',
    image_url: '/img/authors/vikash.jpg',
    email: 'hello@olake.io',
    socials: { linkedin: 'vikash-choudhary-939299226' }
  }
};

export function getAuthorData(authorIds) {
  if (!authorIds || !Array.isArray(authorIds)) return [];
  
  return authorIds.map(id => authorData[id]).filter(Boolean);
}
