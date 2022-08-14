import { Iterator } from './Iterator'

export class CursorBasedIterator extends Iterator {
  private readonly _nextCursor: any
  private readonly _prevCursor: any

  constructor({ items, originQuery, fetchNextPage, fetchPrevPage, limit, nextCursor, prevCursor }) {
    super({ items, originQuery, fetchNextPage, fetchPrevPage, limit });
    this._nextCursor = nextCursor;
    this._prevCursor = prevCursor;
  }

  hasNext() {
    return !!this._nextCursor;
  }

  hasPrev() {
    return !!this._prevCursor;
  }
}
