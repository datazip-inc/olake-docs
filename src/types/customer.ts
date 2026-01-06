export enum CustomerCategory {
  B2B = 'B2B',
  CustomerInternet = 'Consumer Internet',
  Fintech = 'Fintech',
}

export interface CustomerStory {
  title: string;
  description: string;
  route: string;
  img: string;
  alt: string;
  companyName: string;
  category: CustomerCategory;
}
