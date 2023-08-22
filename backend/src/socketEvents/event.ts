import { Langs } from "../types";

export interface Error {
  error: string;
  errorDetails?: [];
}

export interface Success<T> {
  data: T;
}

export type Response<T> = Error | Success<T>;

export type Callback<T> = (res: Response<T>) => void;

export interface ILangs {
  "lang": Langs,
}
