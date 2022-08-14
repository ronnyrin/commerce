const { isNil } = require("lodash");

const DEFAULT_LIMIT = 50;

export class Iterator {
  public _limit: number;
  private _items: any;
  private _fetchNextPage: any;
  private _fetchPrevPage: any;
  private _originQuery: any;

  constructor({ items, originQuery, fetchNextPage, fetchPrevPage, limit }) {
    this._items = items;
    this._fetchNextPage = fetchNextPage;
    this._fetchPrevPage = fetchPrevPage;
    this._originQuery = originQuery;
    this._limit = isNil(limit) ? DEFAULT_LIMIT : limit;
  }

  get items() {
    return this._items;
  }

  get length() {
    return this._items.length;
  }

  get pageSize() {
    return this._limit;
  }

  get query() {
    return this._originQuery;
  }
}
