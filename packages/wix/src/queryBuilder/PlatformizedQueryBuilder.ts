import { isEqual, isEmpty} from 'lodash'
import { renameField } from './renameField'
import filterMixin from './filterBuilder/filterMixin'

const WIX_DATA_EMPTY_FILTER = { $and: [] };

// This can be removed when the platformized-filter-builder
// will stop producing { $and: [] } for an empty filter
const toScalaCompatibleFilter = (filter: any) => (isEqual(filter, WIX_DATA_EMPTY_FILTER) ? {} : filter);

export class PlatformizedQueryBuilder extends filterMixin() {
  constructor(obj: any) {
    super(obj);
    this.sort = obj.sort || [];
    this.paging = obj.paging || {};
  }

  eq(field: any, value: any) {
    debugger
    return super.eq(renameField(field), value);
  }

  ne(field: any, value: any) {
    return super.ne(renameField(field), value);
  }

  ge(field: any, value: any) {
    return super.ge(renameField(field), value);
  }

  gt(field: any, value: any) {
    return super.gt(renameField(field), value);
  }

  le(field: any, value: any) {
    return super.le(renameField(field), value);
  }

  lt(field: any, value: any) {
    return super.lt(renameField(field), value);
  }

  isNotEmpty(field: string) {
    return super.isNotEmpty(renameField(field));
  }

  isEmpty(field: string) {
    return super.isEmpty(renameField(field));
  }

  startsWith(field: string, value: any) {
    return super.startsWith(renameField(field), value);
  }

  endsWith(field: string, value: any) {
    return super.endsWith(renameField(field), value);
  }

  contains(field: string, value: any) {
    return super.contains(renameField(field), value);
  }

  hasSome(field: string, ...values: any) {
    return super.hasSome(renameField(field), ...values);
  }

  hasAll(field: string, ...values: any) {
    return super.hasAll(renameField(field), ...values);
  }

  between(field: string, rangeStart: number, rangeEnd: number) {
    return super.between(renameField(field), rangeStart, rangeEnd);
  }

  /*
    TODO: use the custom in() and exists() implementations from super (PlatformizedFilterBuilder) once it is exposed as a class
    from this module: https://github.com/wix-private/wix-data/blob/master/platformized-filter-builder/src/filterBuilder.es6#L13,
   */

  in(field: string, values: any) {
    return this._AndSetOperand("$in", ".in", [renameField(field), values]);
  }

  exists(field: any, value: any) {
    return this._binaryAnd("$exists", ".exists", [renameField(field), value]);
  }

  ascending(...fieldNames: any) {
    this.sort.push(
      ...fieldNames.map((fieldName: any) => ({ fieldName: renameField(fieldName), order: 'ASC' }))
    );

    return this;
  }

  descending(...fieldNames: any) {
    this.sort.push(
      ...fieldNames.map((fieldName: any) => ({ fieldName: renameField(fieldName), order: 'DESC' }))
    );

    return this;
  }

  skip(offset: number) {
    this.paging.offset = offset;

    return this;
  }

  limit(limit: number) {
    this.paging.limit = limit;

    return this;
  }

  buildQuery() {
    return { ...(!isEmpty(this.getFilterModel()) && {filter: JSON.stringify(toScalaCompatibleFilter(this.getFilterModel()))}), ...(this.sort.length && {sort: this.sort}), paging: this.paging };
  }
}
