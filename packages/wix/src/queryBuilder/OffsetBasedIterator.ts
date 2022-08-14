import { Iterator } from './Iterator'

export class OffsetBasedIterator extends Iterator {
  private readonly _totalCount: number
  private readonly _offset: number
  private readonly _tooManyToCount: boolean
  constructor({ items, fetchNextPage, fetchPrevPage, offset, originQuery, limit, totalCount, tooManyToCount }) {
    super({ items, fetchNextPage, fetchPrevPage, originQuery, limit });
    this._totalCount = totalCount;
    this._offset = offset;
    this._tooManyToCount = tooManyToCount;
  }

  get currentPage() {
    return this._limit === 0 ? undefined : Math.floor(this._offset / this._limit);
  }

  get totalPages() {
    return this._tooManyToCount || this._limit === 0 ? undefined : Math.ceil(this._totalCount / this._limit);
  }

  get totalCount() {
    return this._tooManyToCount ? undefined : this._totalCount;
  }

  hasNext() {
    return this._limit !== 0 && this.currentPage < this.totalPages - 1;
  }

  hasPrev() {
    return this._limit !== 0 && this.currentPage > 0;
  }
}
