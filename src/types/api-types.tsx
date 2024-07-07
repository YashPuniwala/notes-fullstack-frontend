import { Note, Product, User } from "./types";

export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};

export type MessageResponse = {
  success: boolean;
  message: string;
  user: User
};

export type AllUsersResponse = {
  success: boolean;
  users: User[];
};

export type UserResponse = {
  success: boolean;
  user: User;
};

export type NotesResponse = {
  success: boolean;
  notes: Note[];
};

export type productsResponse = {
  success: boolean;
  products: Product[];
}

export interface GetAllProductsQuery {
  category?: string; // Optional category ID
  subcategory?: string; // Optional subcategory ID
  brand?: string; // Optional brand ID
  sort?: string; // Optional brand ID
  priceMin?: number; // Optional brand ID
  priceMax?: number; // Optional brand ID
  price?: number;
  search?: string; // Optional brand ID
}