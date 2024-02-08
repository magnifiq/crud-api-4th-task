export interface ClientSchema {
  id?: string;
  username: string;
  age: number;
  hobbies: string[] | [];
}

export interface ResponseError extends Error {
  code?: string;
  message: string;
}

export interface Content {
  body?: ClientSchema;
  params?: object;
}

export interface MainDoc {
  id?: string;
}

export interface MainCol {
  collectionName: string;
  collectionSchema: { required: Array<string>; types: Record<string, any> };
  store: object;
}
