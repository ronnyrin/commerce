import { PlatformizedQueryBuilder } from './PlatformizedQueryBuilder'
const PagingMethods = { CURSOR: 'CURSOR', OFFSET: 'OFFSET' }

export class PlatformizedQueryMethodWrapper extends PlatformizedQueryBuilder {
  constructor(obj) {
    super(obj)
    this.func = obj.func
    this.requestTransformer = obj.requestTransformer
    this.responseTransformer = obj.responseTransformer
    this.errorTransformer = obj.errorTransformer
    this.pagingMethod = obj.pagingMethod
    this.cursor = obj.cursor
  }

  build() {
    const query = this._buildQuery()
    const request = this.requestTransformer(query, {})
    return this.func(request, {})
  }

  _copyWithCursor(cursor: any) {
    return new PlatformizedQueryMethodWrapper({ ...this, cursor })
  }

  _buildQuery() {
    const queryObject = this.buildQuery()
    if (this.pagingMethod === PagingMethods.CURSOR) {
      return {
        filter: queryObject.filter,
        sort: this.sort,
        cursorPaging: { cursor: this.cursor, limit: this.paging.limit }
      }
    }

    return queryObject
  }

  get _pagingOffset() {
    return this.paging?.offset || 0
  }

  _copyWithOffsetChange(amount: number) {
    const nextPage = { offset: this._pagingOffset + amount, limit: this.paging.limit }

    return new PlatformizedQueryMethodWrapper({ ...this, paging: nextPage })
  }

  _copyWithNextPage() {
    return this._copyWithOffsetChange(this.paging.limit)
  }

  _copyWithPrevPage() {
    return this._copyWithOffsetChange(-this.paging.limit)
  }
}

export const wrapWithQueryBuilder = ({
  func,
  requestTransformer,
  responseTransformer,
  errorTransformer,
  pagingMethod
}: any) => () =>
  new PlatformizedQueryMethodWrapper({
    func,
    requestTransformer,
    responseTransformer,
    errorTransformer,
    pagingMethod
  })
