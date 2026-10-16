/**
 * People named on integration pages as author or technical reviewer.
 *
 * Every page names a real author and a real reviewer. Ids match blog/authors.yml so the same
 * person has one identity across the site; the avatar is the same file.
 */
export interface Person {
  id: string
  name: string
  title: string
  avatar: string
  /** Author page on this site. */
  page?: string
  linkedin?: string
  github?: string
}

export const PEOPLE: Record<string, Person> = {
  shubham: {
    id: 'shubham',
    name: 'Shubham Satish Baldava',
    title: 'Co-founder',
    avatar: '/img/authors/shubham.webp',
    page: '/blog/authors/shubham/',
    linkedin: 'shubham-baldava',
    github: 'shubham-baldava'
  },
  nayan: {
    id: 'nayan',
    name: 'Nayan Joshi',
    title: 'Data Engineer',
    avatar: '/img/authors/nayan.webp',
    page: '/blog/authors/nayan/'
  },
  anshika: {
    id: 'anshika',
    name: 'Anshika',
    title: 'Developer relations, OLake',
    avatar: '/img/authors/anshika.webp',
    page: '/blog/authors/anshika/'
  },
  akshay: {
    id: 'akshay',
    name: 'Akshay Kumar Sharma',
    title: 'Developer relations, OLake',
    avatar: '/img/authors/akshay.webp',
    page: '/blog/authors/akshay/',
    linkedin: 'akshay-kumar-sharma-devvoyager'
  }
}
