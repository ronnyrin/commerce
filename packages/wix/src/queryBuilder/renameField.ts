import { isString } from 'lodash'

const {
  corvidEntities: { adjustName },
} = require("@wix/cloud-edm-autogen-transformations");

export const renameField = (field: any) => {
  if (!isString(field)) {
    return field;
  }

  return field
    .split(".")
    .map((segment) => adjustName(segment))
    .join(".");
};
