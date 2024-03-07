/* eslint-disable */

import { MainDoc } from "../types_of_data";
import Schema from "./Schema";

export default class Database {
  store: Record<string, Array<MainDoc>>;
  private collections: Array<string> = [];
  constructor(
    collections: Schema<MainDoc>[],
    store: Record<string, Array<MainDoc>>
  ) {
    this.store = store;

    collections.forEach((oneCollection): void => {
      const { collectionName } = oneCollection;
      this[collectionName] = oneCollection;
      this.store[collectionName] = [];
      this.collections.push(collectionName);
    });
  }

  public dropCollections(collectionName?: string) {
    if (collectionName) {
      if (this.store[collectionName]) this.store[collectionName] = [];
    } else {
      this.collections.forEach((collection) => {
        this.store[collection] = [];
      });
    }
  }
}
