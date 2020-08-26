/* eslint-disable max-classes-per-file */
const assert = require('assert').strict;

export class ApplicationError extends Error {
  get name() {
    return this.constructor.name;
  }

  get err() {
    return this;
  }
}

export class InvalidRequest extends ApplicationError {
  constructor(message, options) {
    super(message);
    assert(typeof message === 'string');
    assert(typeof options === 'object');
    assert(options !== null);
    for (let i = 0, arr = Object.entries(options); i < arr.length; i += 1) {
      const [key, value] = arr[i];
      this[key] = value;
    }
  }
}
