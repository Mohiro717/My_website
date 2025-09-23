export interface Category {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
}

export interface Tag {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  color?: string;
}

export interface Seo {
  metaTitle?: string;
  metaDescription?: string;
  noIndex?: boolean;
}

export interface Author {
  name: string;
  image?: {
    asset: {
      _ref: string;
    };
    alt?: string;
  };
}

export interface Post {
  _id: string;
  slug: {
    current: string;
  };
  title: string;
  excerpt: string;
  mainImage?: {
    asset: {
      _ref: string;
    };
    alt?: string;
  };
  author: Author;
  publishedAt: string;
  categories: Category[];
  tags: Tag[];
  body: any[];
  seo?: Seo;
  featured?: boolean;
  viewCount?: number;
}

