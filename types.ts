
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
  featured?: boolean;
  viewCount?: number;
}
