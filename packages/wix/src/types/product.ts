export * from '@vercel/commerce/types/product'

export interface WixProduct {
  /**
   * Product ID (generated automatically by the catalog).
   * @readonly
   */
  id: string;
  /** Product name. */
  name: string;
  /**
   * A permanent, friendly URL name (generated automatically by the catalog).
   * @readonly
   */
  slug: string;
  /** Whether the product is visible to site visitors. */
  visible: boolean;
  /** Currently, only creating physical products ( `"productType": "physical"` ) is supported via the API. */
  productType: ProductType;
  /** Product description. Accepts [rich text](https://dev.wix.com/api/rest/wix-stores/rich-text). */
  description: string;
  /** Stock keeping unit (if variant management is enabled, SKUs will be set per variant, and this field will be empty). */
  sku: string;
  /** Product weight (if variant management is enabled, weight will be set per variant, and this field will be empty). */
  weight: number | null;
  /**
   * Product weight range. The minimum and maximum weights of all the variants.
   * @readonly
   */
  weightRange: NumericPropertyRange;
  /**
   * Product inventory status (in future this will be writable via Inventory API).
   * @readonly
   */
  stock: Stock;
  /**
   * Deprecated (use `priceData` instead).
   * @readonly
   */
  price: PriceData;
  /** Price data. */
  priceData: PriceData;
  /**
   * Price data, converted to the currency specified in request header.
   * @readonly
   */
  convertedPriceData: PriceData;
  /**
   * Product price range. The minimum and maximum prices of all the variants.
   * @readonly
   */
  priceRange: NumericPropertyRange;
  /** Cost and profit data. */
  costAndProfitData: CostAndProfitData;
  /**
   * Product cost range. The minimum and maximum costs of all the variants.
   * @readonly
   */
  costRange: NumericPropertyRange;
  /** Price per unit data. */
  pricePerUnitData: PricePerUnitData;
  /**
   * Additional text that the store owner can assign to the product (e.g. shipping details, refund policy, etc.). Currently writable only from the UI.
   * @readonly
   */
  additionalInfoSections: AdditionalInfoSection[];
  /**
   * Deprecated (use `ribbon` instead).
   * @readonly
   */
  ribbons: Ribbon[];
  /**
   * Media items (images, videos etc) associated with this product (writable via [Add Product Media](https://dev.wix.com/api/rest/wix-stores/catalog/products/add-product-media) endpoint).
   * @readonly
   */
  media: Media;
  /**
   * Text box for the customer to add a message to their order (e.g., customization request). Currently writable only from the UI.
   * @readonly
   */
  customTextFields: CustomTextField[];
  /** Whether variants are being managed for this product - enables unique SKU, price and weight per variant. Also affects inventory data. */
  manageVariants: boolean | null;
  /** Options (color, size, etc) for this product. */
  productOptions: WixProductOption[];
  /**
   * Product page URL for this product (generated automatically by the server).
   * @readonly
   */
  productPageUrl: PageUrl;
  /**
   * Product’s unique numeric ID (assigned in ascending order).
   * Primarily used for sorting and filtering when crawling all products.
   * @readonly
   */
  numericId: string;
  /**
   * Inventory item ID - ID referencing the inventory system.
   * @readonly
   */
  inventoryItemId: string;
  /** Discount deducted from the product's original price. */
  discount: Discount;
  /**
   * A list of all collection IDs that this product is included in (writable via the Catalog > Collection APIs).
   * @readonly
   */
  collectionIds: string[];
  /**
   * Product variants, will be provided if the the request was sent with the includeVariants flag.
   * @readonly
   */
  variants: Variant[];
  /**
   * Date and time the product was last updated.
   * @readonly
   */
  lastUpdated: Date;
  /**
   * Date and time the product was created.
   * @readonly
   */
  createdDate: Date;
  /** Custom SEO data for the product. */
  seoData: SeoSchema;
  /** Product ribbon. Used to highlight relevant information about a product. For example, "Sale", "New Arrival", "Sold Out". */
  ribbon: string | null;
  /** Product brand. Including a brand name can help improve site and product [visibility on search engines](https://support.wix.com/en/article/adding-brand-names-to-boost-product-page-seo-in-wix-stores). */
  brand: string | null;
  /**
   * tax group id
   * @internal
   * @readonly
   */
  taxGroupId: string | null;
}

export enum ProductType {
  unspecified_product_type = 'unspecified_product_type',
  physical = 'physical',
  digital = 'digital',
}

export interface NumericPropertyRange {
  /** Minimum value. */
  minValue: number;
  /** Maximum value. */
  maxValue: number;
}

export interface Stock {
  /** Whether inventory is being tracked */
  trackInventory: boolean;
  /** Quantity currently left in inventory */
  quantity: number | null;
  /**
   * Whether the product is currently in stock (relevant only when tracking manually)
   * Deprecated (use `inventoryStatus` instead)
   */
  inStock: boolean;
  /**
   * The current status of the inventory
   * + `IN_STOCK` - In stock
   * + `OUT_OF_STOCK` - Not in stock
   * + `PARTIALLY_OUT_OF_STOCK` - Some of the variants are not in stock
   */
  inventoryStatus: InventoryStatus;
}

export enum InventoryStatus {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  PARTIALLY_OUT_OF_STOCK = 'PARTIALLY_OUT_OF_STOCK',
}

export interface PriceData {
  /**
   * Product price currency
   * @readonly
   */
  currency: string;
  /** Product price */
  price: number;
  /**
   * Discounted product price (if no discounted price is set, the product price is returned)
   * @readonly
   */
  discountedPrice: number;
  /**
   * The product price and discounted price, formatted with the currency
   * @readonly
   */
  formatted: FormattedPrice;
  /**
   * Price per unit
   * @readonly
   */
  pricePerUnit: number | null;
}

export interface FormattedPrice {
  /** Product price formatted with the currency */
  price: string;
  /** Discounted product price formatted with the currency (if no discounted price is set, the product formatted price is returned) */
  discountedPrice: string;
  /**
   * Price per unit
   * @readonly
   */
  pricePerUnit: string | null;
}

export interface CostAndProfitData {
  /** Item cost. */
  itemCost: number | null;
  /**
   * Item cost formatted with currency symbol.
   * @readonly
   */
  formattedItemCost: string;
  /**
   * Profit. Calculated by reducing `cost` from `discounted_price`.
   * @readonly
   */
  profit: number;
  /**
   * Profit formatted with currency symbol.
   * @readonly
   */
  formattedProfit: string;
  /**
   * Profit Margin. Calculated by dividing `profit` by `discounted_price`.
   * The result is rounded to 4 decimal places.
   * @readonly
   */
  profitMargin: number;
}

export interface PricePerUnitData {
  /** Total quantity */
  totalQuantity: number;
  /** Total measurement unit */
  totalMeasurementUnit: MeasurementUnit;
  /** Base quantity */
  baseQuantity: number;
  /** Base measurement unit */
  baseMeasurementUnit: MeasurementUnit;
}

export enum MeasurementUnit {
  UNSPECIFIED = 'UNSPECIFIED',
  ML = 'ML',
  CL = 'CL',
  L = 'L',
  CBM = 'CBM',
  MG = 'MG',
  G = 'G',
  KG = 'KG',
  MM = 'MM',
  CM = 'CM',
  M = 'M',
  SQM = 'SQM',
  OZ = 'OZ',
  LB = 'LB',
  FLOZ = 'FLOZ',
  PT = 'PT',
  QT = 'QT',
  GAL = 'GAL',
  IN = 'IN',
  FT = 'FT',
  YD = 'YD',
  SQFT = 'SQFT',
}

export interface AdditionalInfoSection {
  /** Product info section title */
  title: string;
  /** Product info section description */
  description: string;
}

export interface Ribbon {
  /** Ribbon text */
  text: string;
}

export interface Media {
  /** Primary media (image, video etc) associated with this product. */
  mainMedia: MediaItem;
  /** Media (images, videos etc) associated with this product. */
  items: MediaItem[];
}

export interface MediaItem extends MediaItemItemOneOf {
  /** Media item thumbnail details. */
  thumbnail: MediaItemUrlAndSize;
  /** Media item type (image, video, etc.). */
  mediaType: MediaItemType;
  /** Media item title. */
  title: string;
  /** Media ID (for example, `"nsplsh_306d666a123a4a74306459~mv2_d_4517_2992_s_4_2.jpg"`). */
  id: string;
  /** Image data (URL, size). */
  image: MediaItemUrlAndSize;
  /** Video data (URL, size). */
  video: MediaItemVideo;
}

/** @oneof */
export interface MediaItemItemOneOf {
  /** Image data (URL, size). */
  image: MediaItemUrlAndSize;
  /** Video data (URL, size). */
  video: MediaItemVideo;
}

export interface MediaItemUrlAndSize {
  /** Media item URL. */
  url: string;
  /** Media item width. */
  width: number;
  /** Media item height. */
  height: number;
  /** Media format (mp4, png, etc.). */
  format: string | null;
  /** Alt text. This text will be shown in case the image is not available. */
  altText: string | null;
}

export enum MediaItemType {
  unspecified_media_item_type = 'unspecified_media_item_type',
  image = 'image',
  video = 'video',
  audio = 'audio',
  document = 'document',
  zip = 'zip',
}

export interface MediaItemVideo {
  /** Data (URL, size) about each resolution for which this video is available. */
  files: MediaItemUrlAndSize[];
  /** ID of an image taken from the video. Used primarily for Wix Search indexing. For example, `"nsplsh_306d666a123a4a74306459~mv2_d_4517_2992_s_4_2.jpg"`. */
  stillFrameMediaId: string;
}

export interface CustomTextField {
  /** Text box title */
  title: string;
  /** Text box input max length */
  maxLength: number;
  /** Whether this text box is mandatory */
  mandatory: boolean;
}

export interface WixProductOption {
  /**
   * Option type - color or other(drop down)
   * @readonly
   */
  optionType: OptionType;
  /** Option name (e.g., color, size) */
  name: string;
  /** Choices available for this option */
  choices: Choice[];
}

export enum OptionType {
  unspecified_option_type = 'unspecified_option_type',
  drop_down = 'drop_down',
  color = 'color',
}

export interface Choice {
  /** Color hex value or choice name */
  value: string;
  /** Choice name */
  description: string;
  /**
   * Media items (images, videos) associated with this choice
   * @readonly
   */
  media: Media;
  /**
   * Based on the customer’s choices, which (if any) variants that include the selected choices are in stock
   * @readonly
   */
  inStock: boolean;
  /**
   * Based on the customer’s choices, which (if any) variants that include the selected choices are visible
   * @readonly
   */
  visible: boolean;
}

export interface PageUrl {
  /** Base URL. For premium sites, this is the domain. For free sites, this is the site URL (e.g mysite.wixsite.com/mysite). */
  base: string;
  /** Path to the product page - e.g /product-page/a-product. */
  path: string;
}

export interface Discount {
  /** Discount type: amount / percent */
  type: DiscountType;
  /** Discount value */
  value: number;
}

export enum DiscountType {
  UNDEFINED = 'UNDEFINED',
  /** No discount */
  NONE = 'NONE',
  AMOUNT = 'AMOUNT',
  PERCENT = 'PERCENT',
}

export interface Variant {
  /** Requested Variant ID */
  id: string;
  /** Specific choices within a selection, as option-choice key-value pairs */
  choices: Record<string, string>;
  variant: VariantDataWithNoStock;
  /**
   * Variant inventory status.
   * @readonly
   */
  stock: VariantStock;
}

export interface VariantDataWithNoStock {
  /** Variant price. */
  priceData: PriceData;
  /**
   * Variant price data, converted to currency requested in header.
   * @readonly
   */
  convertedPriceData: PriceData;
  /** Cost and profit data. */
  costAndProfitData: CostAndProfitData;
  /** Variant weight. */
  weight: number;
  /** Variant SKU (stock keeping unit). */
  sku: string;
  /** Whether the variant is visible to customers. */
  visible: boolean;
}

export interface VariantStock {
  /** Whether inventory is being tracked. */
  trackQuantity: boolean;
  /** Quantity currently left in inventory. */
  quantity: number | null;
  /** Whether the product is currently in stock (relevant only when tracking manually). */
  inStock: boolean;
}

/**
 * The SEO schema object contains data about different types of meta tags. It makes sure that the information about your page is presented properly to search engines.
 * The search engines use this information for ranking purposes, or to display snippets in the search results.
 * This data will override other sources of tags (for example patterns) and will be included in the <head> section of the HTML document, while not being displayed on the page itself.
 */
export interface SeoSchema {
  /** SEO tags information. */
  tags: Tag[];
  /** SEO general settings. */
  settings: Settings;
}

export interface Tag {
  /** SEO tag type. Supported values: `title`, `meta`, `script`, `link`. */
  type: string;
  /** SEO tag attributes/properties (name, content, rel, href). */
  props: Record<string, any> | null;
  /** Tag meta data, e.g. {height: 300, width: 240}. */
  meta: Record<string, any> | null;
  /** Tag inner content e.g. `<title> inner content </title>`. */
  children: string;
  /** Whether the tag is a custom tag. */
  custom: boolean;
  /** Whether the tag is disabled. */
  disabled: boolean;
}

export interface Settings {
  /** disable auto creation of 301 redirects on slug changes (enabled by default). */
  preventAutoRedirect: boolean;
}

export interface AddProductMediaRequest {
  /** Product ID. */
  id: string;
  media: MediaDataForWrite[];
}

export interface MediaDataForWrite extends MediaDataForWriteMediaSourceOneOf {
  /**
   * Optional - assign this media item to a specific product choice.
   * Note that you may set media items for choices under only one option (e.g., if Colors blue, green, and red have media items, Sizes S, M, and L can't have media items assigned to them).
   * You may clear existing media from choices via the Remove Product Media From Choices endpoint
   */
  choice: OptionAndChoice;
  /** Media ID. For media items previously saved in Wix Media, the media ID is returned in the Query Product response. */
  mediaId: string;
  /** Media external URL (for new media items). */
  url: string;
}

/** @oneof */
export interface MediaDataForWriteMediaSourceOneOf {
  /** Media ID. For media items previously saved in Wix Media, the media ID is returned in the Query Product response. */
  mediaId: string;
  /** Media external URL (for new media items). */
  url: string;
}

export interface OptionAndChoice {
  option: string;
  choice: string;
}

export interface Collection {
  /**
   * Collection ID (generated automatically by the catalog)
   * @readonly
   */
  id: string;
  /** Collection name */
  name: string;
  /**
   * Media items (images, videos etc) associated with this collection. Read only.
   * @readonly
   */
  media: Media;
  /**
   * Number of products in the collection. Read only.
   * @readonly
   */
  numberOfProducts: number;
}

export interface Query {
  paging: Paging;
  /** Filter string */
  filter: string | null;
  /** Sort string */
  sort: string | null;
}

export interface Paging {
  /** Amount of items to load per page */
  limit: number | null;
  /** Number of items to skip in the display (relevant for all pages after the first) */
  offset: number | null;
}

export interface QueryProductsResponse {
  products: WixProduct[];
  metadata: PagingMetadata;
  totalResults: number;
}

export interface PagingMetadata {
  /** Amount of items to load per page */
  items: number;
  /** Number of items to skip in the display (relevant for all pages after the first) */
  offset: number;
}

export interface GetProductResponse {
  /** Requested product data. */
  product: WixProduct;
}

export interface QueryCollectionsRequest {
  query: Query;
  /** Whether number of products should be included in the response. */
  includeNumberOfProducts: boolean;
}

export interface QueryCollectionsResponse {
  collections: Collection[];
  metadata: PagingMetadata;
  totalResults: number;
}

export interface Sorting {
  /** Name of the field to sort by. */
  fieldName: string;
  /** Sort order. */
  order: SortOrder;
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface Image {
  /** WixMedia image ID. */
  id: string;
  /** Image URL. */
  url: string;
  /**
   * Original image height.
   * @readonly
   */
  height: number;
  /**
   * Original image width.
   * @readonly
   */
  width: number;
  /** Image alt text. Optional. */
  altText: string | null;
  /**
   * Image URL expiration date (when relevant). Optional
   * @internal
   * @readonly
   */
  urlExpirationDate: Date;
  /**
   * Image filename. Optional.
   * @readonly
   */
  filename: string | null;
  /**
   * Image size in bytes. Optional.
   * @internal
   * @readonly
   */
  sizeInBytes: string | null;
}

export interface Cursors {
  /** Cursor pointing to next page in the list of results. */
  next: string | null;
  /** Cursor pointing to previous page in the list of results. */
  prev: string | null;
}
