import {
  serializer,
  transformError,
  resolveQueryFieldsTransformationPaths,
} from '@wix/metro-runtime/velo';
import * as ambassadorWixStoresCatalogV1Product from '@wix/ambassador-stores-catalog-v1-product/http';
// @ts-ignore
import { wrapWithQueryBuilder } from '@wix/cloud-edm-autogen-query-wrapper';

let __verbose = false;

function __log(...args: any[]) {
  __verbose && console.log(...args);
}

function __inspect(obj: any) {
  return obj;
}

export const __debug = {
  verboseLogging: {
    on: () => (__verbose = true),
    off: () => (__verbose = false),
  },
};
const _toVeloEntity = {
  _id: '$.id',
  name: '$.title',
  collectionId: '$.collectionId',
  _createdDate: '$.createdDate',
  modifiedDate: '$.modifiedDate',
  image: '$.image',
  address: '$.address',
  document: '$.document',
  video: '$.video',
  pageLink: '$.pageLink',
  audio: '$.audio',
  color: '$.color',
  localDate: '$.localDate',
  localTime: '$.localTime',
  localDateTime: '$.localDateTime',
  variants: '$.variants',
  mainVariant: '$.mainVariant',
  customAddress: '$.customAddress',
  guid: '$.guid',
};
const _fromVeloEntity = {
  id: '$._id',
  title: '$.name',
  collectionId: '$.collectionId',
  createdDate: '$._createdDate',
  modifiedDate: '$.modifiedDate',
  image: '$.image',
  address: '$.address',
  document: '$.document',
  video: '$.video',
  pageLink: '$.pageLink',
  audio: '$.audio',
  color: '$.color',
  localDate: '$.localDate',
  localTime: '$.localTime',
  localDateTime: '$.localDateTime',
  variants: '$.variants',
  mainVariant: '$.mainVariant',
  customAddress: '$.customAddress',
  guid: '$.guid',
};

/** Physical address */
export interface Address extends AddressStreetOneOf {
  /** Country code. */
  country?: string | null;
  /** Subdivision. Usually a state, region, prefecture, or province code, according to [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2). */
  subdivision?: string | null;
  /** City name. */
  city?: string | null;
  /** Zip/postal code. */
  postalCode?: string | null;
  /** Free text providing more detailed address info. Usually contains Apt, Suite, and Floor. */
  addressLine2?: string | null;
  /**
   * A string containing the full address of this location.
   * @internal
   */
  formattedAddress?: string | null;
  /**
   * Free text to help find the address.
   * @internal
   */
  hint?: string | null;
  /**
   * Coordinates of the physical address.
   * @internal
   */
  geocode?: AddressLocation;
  /**
   * Country full name.
   * @internal
   */
  countryFullname?: string | null;
  /**
   * Subdivision full name.
   * @internal
   */
  subdivisionFullname?: string | null;
  /**
   * Multi-level subdivisions from top to bottom.
   * @internal
   */
  subdivisions?: Subdivision[];
  /** Street name and number. */
  streetAddress?: StreetAddress;
  /** Main address line, usually street and number as free text. */
  addressLine?: string | null;
}

/** @oneof */
export interface AddressStreetOneOf {
  /** Street name and number. */
  streetAddress?: StreetAddress;
  /** Main address line, usually street and number as free text. */
  addressLine?: string | null;
}

export interface StreetAddress {
  /** Street number. */
  number?: string;
  /** Street name. */
  name?: string;
  /**
   * Apartment number.
   * @internal
   */
  apt?: string;
}

export interface AddressLocation {
  /** Address latitude. */
  latitude?: number | null;
  /** Address longitude. */
  longitude?: number | null;
}

export interface Subdivision {
  /** Short subdivision code. */
  code?: string;
  /** Subdivision full name. */
  name?: string;
  /**
   * Subdivision level
   * @internal
   */
  type?: SubdivisionType;
  /**
   * Free text description of subdivision type.
   * @internal
   */
  typeInfo?: string | null;
}

export enum SubdivisionType {
  UNKNOWN_SUBDIVISION_TYPE = 'UNKNOWN_SUBDIVISION_TYPE',
  /** State */
  ADMINISTRATIVE_AREA_LEVEL_1 = 'ADMINISTRATIVE_AREA_LEVEL_1',
  /** County */
  ADMINISTRATIVE_AREA_LEVEL_2 = 'ADMINISTRATIVE_AREA_LEVEL_2',
  /** City/town */
  ADMINISTRATIVE_AREA_LEVEL_3 = 'ADMINISTRATIVE_AREA_LEVEL_3',
  /** Neighborhood/quarter */
  ADMINISTRATIVE_AREA_LEVEL_4 = 'ADMINISTRATIVE_AREA_LEVEL_4',
  /** Street/block */
  ADMINISTRATIVE_AREA_LEVEL_5 = 'ADMINISTRATIVE_AREA_LEVEL_5',
  /** ADMINISTRATIVE_AREA_LEVEL_0. Indicates the national political entity, and is typically the highest order type returned by the Geocoder. */
  COUNTRY = 'COUNTRY',
}

export interface VideoResolution {
  /** Video URL. */
  url?: string;
  /** Video height. */
  height?: number;
  /** Video width. */
  width?: number;
  /**
   * Video poster. Deprecated, please use the `posters` property in the parent entity
   * @internal
   */
  poster?: string;
  /** Video format for example, mp4, hls. */
  format?: string;
  /**
   * Video URL expiration date (when relevant). Optional. Deprecated, please use the `urlExpirationDate` property in the parent entity
   * @internal
   */
  urlExpirationDate?: Date;
  /**
   * Video size in bytes. Optional. Deprecated, please use the `sizeInBytes` property in the parent entity. Size cannot be provided per resolution
   * @internal
   */
  sizeInBytes?: string | null;
  /**
   * Video quality for example 480p, 720p
   * @internal
   */
  quality?: string | null;
  /**
   * Video filename. Optional.
   * @internal
   */
  filename?: string | null;
}

export interface PageLink {
  /** The page id we want from the site */
  pageId?: string;
  /** Where this link should open, supports _self and _blank or any name the user chooses. _self means same page, _blank means new page. */
  target?: string | null;
}

export interface Variant {
  name?: string;
  value?: string;
  image?: string;
}

export interface MyAddress {
  country?: string | null;
  subdivision?: string | null;
  city?: string | null;
  postalCode?: string | null;
  streetAddress?: StreetAddress;
  /** @internal */
  formattedAddress?: string | null;
}

export interface CreateProductRequest {
  product?: Product;
}

export interface CreateProductResponse {
  product?: Product;
}

export interface DeleteProductRequest {
  productId: string;
}

export interface DeleteProductResponse {}

export interface UpdateProductRequest {
  productId: string;
  product?: Product;
}

export interface UpdateProductResponse {
  product?: Product;
}

export interface GetProductRequest {
  productId: string;
}

export interface GetProductResponse {
  product?: Product;
}

export interface QueryProductsRequest {
  query?: QueryV2;
  /** Whether variants should be included in the response. */
  includeVariants?: boolean;
  /** Whether hidden products should be included in the response. Requires permissions to manage products. */
  includeHiddenProducts?: boolean;
  /** Whether merchant specific data should be included in the response. Requires permissions to manage products. */
  includeMerchantSpecificData?: boolean;
}

export interface QueryV2 extends QueryV2PagingMethodOneOf {
  /**
   * Filter object in the following format:
   * `"filter" : {
   * "fieldName1": "value1",
   * "fieldName2":{"$operator":"value2"}
   * }`
   * Example of operators: `$eq`, `$ne`, `$lt`, `$lte`, `$gt`, `$gte`, `$in`, `$hasSome`, `$hasAll`, `$startsWith`, `$contains`
   */
  filter?: Record<string, any> | null;
  /**
   * Sort object in the following format:
   * `[{"fieldName":"sortField1","order":"ASC"},{"fieldName":"sortField2","order":"DESC"}]`
   */
  sort?: Sorting[];
  /** Array of projected fields. A list of specific field names to return. If `fieldsets` are also specified, the union of `fieldsets` and `fields` is returned. */
  fields?: string[];
  /** Array of named, predefined sets of projected fields. A array of predefined named sets of fields to be returned. Specifying multiple `fieldsets` will return the union of fields from all sets. If `fields` are also specified, the union of `fieldsets` and `fields` is returned. */
  fieldsets?: string[];
  /** Paging options to limit and skip the number of items. */
  paging?: Paging;
  /** Cursor token pointing to a page of results. Not used in the first request. Following requests use the cursor token and not `filter` or `sort`. */
  cursorPaging?: CursorPaging;
}

/** @oneof */
export interface QueryV2PagingMethodOneOf {
  /** Paging options to limit and skip the number of items. */
  paging?: Paging;
  /** Cursor token pointing to a page of results. Not used in the first request. Following requests use the cursor token and not `filter` or `sort`. */
  cursorPaging?: CursorPaging;
}

export interface Sorting {
  /** Name of the field to sort by. */
  fieldName?: string;
  /** Sort order. */
  order?: SortOrder;
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface Paging {
  /** Number of items to load. */
  limit?: number | null;
  /** Number of items to skip in the current sort order. */
  offset?: number | null;
}

export interface CursorPaging {
  /** Number of items to load. */
  limit?: number | null;
  /**
   * Pointer to the next or previous page in the list of results.
   *
   * You can get the relevant cursor token
   * from the `pagingMetadata` object in the previous call's response.
   * Not relevant for the first request.
   */
  cursor?: string | null;
}

export interface QueryProductsResponse {
  products?: Product[];
  metadata?: PagingMetadataV2;
}

export interface PagingMetadataV2 {
  /** Number of items returned in the response. */
  count?: number | null;
  /** Offset that was requested. */
  offset?: number | null;
  /** Total number of items that match the query. Returned if offset paging is used and the `tooManyToCount` flag is not set. */
  total?: number | null;
  /** Flag that indicates the server failed to calculate the `total` field. */
  tooManyToCount?: boolean | null;
  /** Cursors to navigate through the result pages using `next` and `prev`. Returned if cursor paging is used. */
  cursors?: Cursors;
  /**
   * Indicates if there are more results after the current page.
   * If `true`, another page of results can be retrieved.
   * If `false`, this is the last page.
   * @internal
   */
  hasNext?: boolean | null;
}

export interface Cursors {
  /** Cursor pointing to next page in the list of results. */
  next?: string | null;
  /** Cursor pointing to previous page in the list of results. */
  prev?: string | null;
}

const _createProductRequest = { product: '_product' };
const _createProductResponse = { product: '_product' };
const _deleteProductRequest = {};
const _deleteProductResponse = {};
const _getProductRequest = {};
const _getProductResponse = { product: '_product' };
const _product = {
  image: 'wix.common.Image',
  address: 'wix.common.Address',
  document: 'wix.common.Document',
  video: 'wix.common.VideoV2',
  audio: 'wix.common.Audio',
  customAddress: 'wix.common.Address',
  variants: '_variant',
  mainVariant: '_variant',
};
const _queryProductsRequest = {};
const _queryProductsResponse = { products: '_product' };
const _updateProductRequest = { product: '_product' };
const _updateProductResponse = { product: '_product' };
const _variant = { image: 'wix.common.Image' };

export type Product = {
  _id: string;
  name: string;
  collectionId: string;
  _createdDate: Date;
  modifiedDate: Date;
  image: string;
  address: Address;
  document: string;
  video: string;
  pageLink: PageLink;
  audio: string;
  color: string | null;
  localDate: string | null;
  localTime: string | null;
  localDateTime: string | null;
  variants: Variant[];
  mainVariant: Variant;
  customAddress: MyAddress;
  guid: string;
};

/** @public */
export function queryProducts(): ProductsQueryBuilder {
  const requestTransformation = { '*': '$[1]', query: '$[0]' };
  const responseTransformation = {
    items: '$.products',
    pagingMetadata: '$.metadata',
  };

  const { toAmbassadorRequest } = serializer({
    rootSchema: _queryProductsRequest,
    depSchemas: {},
    fqdnTransformation: {
      paths: [],
      transformation: _fromVeloEntity,
    },
    customTransformation: requestTransformation,
  });

  const { fromJSON } = serializer({
    rootSchema: _queryProductsResponse,
    depSchemas: {},
    fqdnTransformation: {
      paths: [...['Array#products']],
      transformation: _toVeloEntity,
    },
    customTransformation: responseTransformation,
  });

  return wrapWithQueryBuilder({
    func: (payload: any) => {
      const reqOpts =
        ambassadorWixStoresCatalogV1Product.queryProducts(payload);

      return {reqOpts, fromJSON}
    },
    requestTransformer: (...args: any[]) => toAmbassadorRequest(args),
    responseTransformer: ({ data }: any) => fromJSON(data),
    errorTransformer: (err: any) => {
      const transformedError = transformError(err, requestTransformation);

      throw transformedError;
    },
    // pagingMethod: 'CURSOR',
    transformationPaths: resolveQueryFieldsTransformationPaths(_toVeloEntity),
  })({ cursorWithEmptyFilterAndSort: true });
}

interface QueryCursorResult {
  hasNext: () => boolean;
  hasPrev: () => boolean;
  length: number;
  pageSize: number;
}

export interface ProductsQueryResult extends QueryCursorResult {
  items: Product[];
  query: ProductsQueryBuilder;
  next: () => Promise<ProductsQueryResult>;
  prev: () => Promise<ProductsQueryResult>;
}

export interface ProductsQueryBuilder {
  eq: (propertyName: string, value: any) => ProductsQueryBuilder;
  ne: (propertyName: string, value: any) => ProductsQueryBuilder;
  startsWith: (propertyName: string, value: any) => ProductsQueryBuilder;
  hasSome: (propertyName: string, value: any[]) => ProductsQueryBuilder;
  in: (propertyName: string, value: any) => ProductsQueryBuilder;
  exists: (propertyName: string, value: boolean) => ProductsQueryBuilder;
  ascending: (...propertyNames: string[]) => ProductsQueryBuilder;
  descending: (...propertyNames: string[]) => ProductsQueryBuilder;
  limit: (limit: number) => ProductsQueryBuilder;
  find: () => Promise<ProductsQueryResult>;
}

export const products = {queryProducts}
