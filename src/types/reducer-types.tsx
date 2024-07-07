import { User } from "./types";

export interface UserReducerInitialState {
  user: User | null;
  loading: boolean;
  message: string;
  error: string;
  isAuthenticated: boolean,
}