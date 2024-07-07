export type User = {
  name?: string;
  email: string;
  password: string;
  role?: string;
};

export type Note = {
  _id?: string;
  id?: string;
  title: string;
  content: string;
};

export type Product = {
  _id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  category?: string; // Assuming category is a string representing the category ID
  subcategory?: string; // Assuming subcategory is a string representing the subcategory ID
  brand?: string; // Assuming brand is a string representing the brand ID
};

export interface Category {
  _id: string;
  name: string;
  subcategories: Subcategory[];
  brands: Brand[];
  colors: Color[];
}

interface Subcategory {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface Color {
  _id: string;
  name: string;
}