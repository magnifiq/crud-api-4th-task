/* eslint-disable */

import { MainDoc, ResponseError } from "../types_of_data";
import { v4 as uuid } from "uuid";
import Validator from "./Validator";

export default class Schema<T extends MainDoc> extends Validator<T> {
  public collectionName: string;
  private required: Array<string>;
  private types: T;
  store: Record<string, Array<T>>;

  constructor(
    collectionName: string,
    collectionSchema,
    store: Record<string, Array<T>>
  ) {
    super();
    this.collectionName = collectionName;
    this.required = collectionSchema.required;
    this.types = collectionSchema.types;
    this.store = store;

    this.store[collectionName] = [];
  }

  async insert(object: T): Promise<T> {
    return new Promise((resolve, reject) => {
      const [isValid, error] = this.validateFields(
        this.required,
        this.types,
        object
      );

      if (!isValid) {
        reject(error);
      }

      const documentToSave = { id: uuid(), ...object };
      this.store[this.collectionName].push(documentToSave);
      resolve(documentToSave);
    });
  }

  find(query?: Partial<T> | null): Promise<Array<T>> {
    return new Promise((resolve) => {
      if (query === undefined || query === null) {
        resolve(this.store[this.collectionName]);
      } else {
        const queryValues = Object.entries(query);
        const result = this.store[this.collectionName].filter((document) =>
          queryValues.every(([key, value]) => document[key] === value)
        );
        resolve(result);
      }
    });
  }

  delete(object: MainDoc): Promise<T> {
    return new Promise((resolve, reject) => {
      const index = this.store[this.collectionName].findIndex(
        (record) => record.id === object.id
      );

      if (index !== -1) {
        const deletedRecord = this.store[this.collectionName][index];
        this.store[this.collectionName] = this.store[
          this.collectionName
        ].filter((record) => record.id !== object.id);
        resolve(deletedRecord);
      }

      const error: ResponseError = new Error(
        "Document with such id does not exist"
      );
      error.code = "NOT_FOUND";
      reject(error);
    });
  }

  update(query: MainDoc, newValues: Partial<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      let availableValues;
      if (Reflect.has(newValues, "id")) {
        const { id, ...values } = newValues;
        availableValues = values;
      } else {
        availableValues = newValues;
      }

      const [isValid, error] = this.validateFields(null, this.types, newValues);

      if (!isValid) {
        reject(error);
      }

      const index = this.store[this.collectionName].findIndex(
        (record) => record.id === query.id
      );

      if (index !== -1) {
        this.store[this.collectionName][index] = Object.assign(
          this.store[this.collectionName][index],
          availableValues
        );
        resolve(this.store[this.collectionName][index]);
      }

      const notFoundError: ResponseError = new Error(
        "Document with such id does not exist"
      );
      notFoundError.code = "NOT_FOUND";
      reject(notFoundError);
    });
  }
}
