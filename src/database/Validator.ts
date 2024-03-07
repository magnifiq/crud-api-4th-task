/* eslint-disable */

export default abstract class Validator<T> {
  validateFields(
    required: Array<string> | null,
    schema: T,
    body: object
  ): [boolean, Error] {
    let result = true;
    let error;

    if (required && required.length && !this.isFieldsPresent(required, body)) {
      result = false;
      error = new Error(`The fields "${required.join('", "')}" are required!`);
    }

    if (!this.checkTypes(body, schema)) {
      result = false;
      error = new Error(
        `Invalid field type, should be: ${JSON.stringify(schema)}`
      );
    }

    return [result, error];
  }

  private checkTypes<K>(body, schema: K) {
    return Object.entries(body).every(([key, value]) => {
      if (Array.isArray(value)) {
        return (
          value.every((val) => schema[key][0] === typeof val) || !value.length
        );
      }

      return typeof value === schema[key];
    });
  }
  private isFieldsPresent(required: Array<string>, body) {
    return required.every((field) =>
      Object.keys(body).includes(field as string)
    );
  }
}
