/* eslint-disable */

import Schema from "./Schema";
import Database from "./Database";
import { ClientSchema } from "../types_of_data";

export const userRequired: Array<keyof ClientSchema> = [
  "username",
  "age",
  "hobbies",
];

export const userFieldsTypes = {
  username: "string",
  age: "number",
  hobbies: ["string"],
};

const store = {};
const UserModel = new Schema<ClientSchema>(
  "users",
  {
    required: userRequired,
    types: userFieldsTypes,
  },
  store
);

export const db = new Database([UserModel], store);

export default UserModel;
