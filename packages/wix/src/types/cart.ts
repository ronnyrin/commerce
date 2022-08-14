import * as Core from '@vercel/commerce/types/cart'

export * from '@vercel/commerce/types/cart'

export interface WixCartLineItem {
  /** Line item ID. */
  id: string;
  /** Item quantity. */
  quantity: number;
  /**
   * Catalog and item reference info. See [Catalog SPI](https://bo.wix.com/wix-docs/rest/ecommerce/catalog-spi/introduction) for more details.
   * Empty in the case of a custom line item.
   */
  catalogReference: CatalogReference;
  /**
   * Item name.
   * + Stores - `product.name`
   * + Bookings - `service.info.name`
   * + Events - `ticket.name`
   * @readonly
   */
  productName: ProductName;
  /**
   * URL to the item's page on the site.
   * @readonly
   */
  url: PageUrlV2;
  /**
   * Item price **after** catalog-defined discount and line item discounts.
   * @readonly
   */
  price: MultiCurrencyPrice;
  /**
   * Item price **before** catalog-defined discount. Defaults to `price` when not provided.
   * @readonly
   */
  fullPrice: MultiCurrencyPrice;
  /**
   * Item price **before** line item discounts and **after** catalog-defined discount. Defaults to `price` when not provided.
   * @readonly
   */
  priceBeforeDiscounts: MultiCurrencyPrice;
  /**
   * Line item description lines. Used for display purposes for the cart, checkout and order.
   * @readonly
   */
  descriptionLines: DescriptionLine[];
  /**
   * Line item image details.
   * @readonly
   */
  image: Image;
  /**
   * Item availability details.
   * @readonly
   */
  availability: ItemAvailabilityInfo;
  /**
   * Physical properties of the item. When relevant, contains information such as SKU, item weight, and shippability.
   * @readonly
   */
  physicalProperties: PhysicalProperties;
  /**
   * Coupon scopes - which app and items a coupon applies to.
   * This field is internal to Wix, and should be used by Bookings, Stores and Events as used by the current [Coupons API](https://bo.wix.com/wix-docs/rest/stores/coupons/valid-scope-values).
   * @internal
   * @readonly
   */
  couponScopes: Scope[];
  /**
   * Item type. Either a preset type or custom.
   * @readonly
   */
  itemType: ItemType;
  /**
   * Subscription option information.
   * @internal
   * @readonly
   */
  subscriptionOptionInfo: SubscriptionOptionInfo;
  /**
   * Digital file identifier, relevant only for items with type DIGITAL.
   * @internal
   * @readonly
   */
  digitalFile: SecuredMedia;
  /**
   * Type of selected payment option for current item. Defaults to `FULL_PAYMENT_ONLINE`.
   * + `FULL_PAYMENT_ONLINE` - The entire payment for this item happens as part of the checkout.
   * + `FULL_PAYMENT_OFFLINE` - The entire payment for this item happens after the checkout. For example, when using cash, check, or other offline payment methods.
   * + `MEMBERSHIP` - Payment for this item is done by charging a membership. When this option is used, `lineItem.price.amount` is 0.
   * @readonly
   */
  paymentOption: PaymentOptionType;
  /**
   * Service properties. When relevant, this contains information such as date and number of participants.
   * @readonly
   */
  serviceProperties: ServiceProperties;
  /**
   * In cases where `catalogReference.catalogItemId` is NOT the actual catalog item ID, this field will return the true item's ID.
   * + For example, for Wix Bookings, `catalogReference.catalogItemId` is the booking ID. Therefore this value is set to the service ID.
   * + in most cases, this field is the name as `catalogReference.catalogItemId`.
   * + Used in membership validation.
   * @readonly
   */
  rootCatalogItemId: string | null;
  /**
   * Additional description for the price. For example, when price is 0 but additional details about the actual price are needed - "Starts at $67".
   * @readonly
   */
  priceDescription: PriceDescription;
}

/** Used for grouping line items and is sent on add to cart */
export interface CatalogReference {
  /** ID of the item within its Wix or 3rd-party catalog. For example, `productId` for Wix Stores or `eventId` for Wix Events. */
  catalogItemId: string;
  /** ID of the catalog app. For example, the Wix Stores `appId`, or the 3rd-party `appId`. */
  appId: string;
  /** Additional info in key:value form. For example, `{"options":{"Size": "M", "Color": "Red"}}` or `{"variantId": "<VARIANT_ID>"}`. */
  options: Record<string, any> | null;
}

export interface ProductName {
  /** *Required** - Original product name (in site's default language). */
  original: string;
  /** Optional - Translated product name according to buyer language. Defaults to `original` when not provided. */
  translated: string;
}

export interface PageUrlV2 {
  /** The path to that page - e.g /product-page/a-product */
  relativePath: string;
  /** The URL of that page. e.g https://mysite.com/product-page/a-product */
  url: string | null;
}

export interface MultiCurrencyPrice {
  /** Amount. */
  amount: string;
  /**
   * Converted amount.
   * @readonly
   */
  convertedAmount: string;
  /**
   * Amount formatted with currency symbol.
   * @readonly
   */
  formattedAmount: string;
  /**
   * Converted amount formatted with currency symbol.
   * @readonly
   */
  formattedConvertedAmount: string;
}

export interface DescriptionLine
  extends DescriptionLineValueOneOf,
    DescriptionLineDescriptionLineValueOneOf {
  /** Description line name. */
  name: DescriptionLineName;
  /**
   * Description line type.
   * @internal
   */
  lineType: DescriptionLineType;
  /** Description line plain text value. */
  plainText: PlainTextValue;
  /** Description line color value. */
  colorInfo: Color;
  /**
   * Description line plain text value.
   * @internal
   */
  plainTextValue: PlainTextValue;
  /**
   * Description line color.
   * @internal
   */
  color: string;
}

/** @oneof */
export interface DescriptionLineValueOneOf {
  /** Description line plain text value. */
  plainText: PlainTextValue;
  /** Description line color value. */
  colorInfo: Color;
}

/** @oneof */
export interface DescriptionLineDescriptionLineValueOneOf {
  /**
   * Description line plain text value.
   * @internal
   */
  plainTextValue: PlainTextValue;
  /**
   * Description line color.
   * @internal
   */
  color: string;
}

export interface DescriptionLineName {
  /** Optional - Description line name in site's default language. */
  original: string;
  /** Optional - Translated description line item according to buyer language. Defaults to `original` when not provided. */
  translated: string;
}

export interface PlainTextValue {
  /** Optional - Description line plain text value in site's default language. */
  original: string;
  /** Optional - Translated description line plain text value according to buyer language. Defaults to `original` when not provided. */
  translated: string;
}

export interface Color {
  /** Optional - Description line color name in site's default language. */
  original: string;
  /** Optional - Translated description line color name according to buyer language. Defaults to `original` when not provided. */
  translated: string;
  /** Optional - HEX or RGB color code for display. */
  code: string;
}

export enum DescriptionLineType {
  UNRECOGNISED = 'UNRECOGNISED',
  PLAIN_TEXT = 'PLAIN_TEXT',
  COLOR = 'COLOR',
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

export interface ItemAvailabilityInfo {
  /**
   * Item availability status. Supported Values:
   * + `"NOT_FOUND"`: Item does not exist
   * + `"NOT_AVAILABLE"`: Item not in stock
   * + `"PARTIALLY_AVAILABLE"`: Available quantity is less than requested
   */
  status: ItemAvailabilityStatus;
  /** Quantity available. */
  quantityAvailable: number | null;
}

export enum ItemAvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  NOT_FOUND = 'NOT_FOUND',
  /** Not in stock */
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  /** Available quantity is less than requested */
  PARTIALLY_AVAILABLE = 'PARTIALLY_AVAILABLE',
}

export interface PhysicalProperties {
  /** Line item weight. Measurement unit (KG or LB) is taken from `order.weightUnit`. */
  weight: number | null;
  /** Stock-keeping unit. Learn more about [SKUs](https://www.wix.com/encyclopedia/definition/stock-keeping-unit-sku). */
  sku: string | null;
  /** Whether this line item is shippable. */
  shippable: boolean;
}

export interface Scope {
  /** Scope namespace (Wix Stores, Wix Bookings, Wix Events) */
  namespace: string;
  /** Coupon scope's applied group (e.g., event or ticket in Wix Events) */
  group: Group;
}

export interface Group {
  /** Coupon scope's group (e.g., product or collection in Wix Stores). See [valid scope values](https://dev.wix.com/api/rest/coupons/coupons/valid-scope-values). */
  name: string;
  /** Item ID (when the coupon scope is limited to just one item). */
  entityId: string | null;
}

export interface ItemType extends ItemTypeItemTypeDataOneOf {
  /** Preset item type. */
  preset: ItemTypeItemType;
  /** Custom item type. */
  custom: string;
}

/** @oneof */
export interface ItemTypeItemTypeDataOneOf {
  /** Preset item type. */
  preset: ItemTypeItemType;
  /** Custom item type. */
  custom: string;
}

export enum ItemTypeItemType {
  UNRECOGNISED = 'UNRECOGNISED',
  PHYSICAL = 'PHYSICAL',
  DIGITAL = 'DIGITAL',
  GIFT_CARD = 'GIFT_CARD',
  SERVICE = 'SERVICE',
}

export interface SubscriptionOptionInfo {
  /** Subscription option settings. */
  subscriptionSettings: SubscriptionSettings;
  /** Subscription option title. */
  title: Title;
  /** Subscription option description. */
  description: Description;
}

export interface SubscriptionSettings {
  /** Frequency of recurring payment. */
  frequency: SubscriptionFrequency;
  /**
   * Interval of recurring payment (optional: default value 1 will be used if not provided, other values are not supported yet)
   * @internal
   */
  interval: number | null;
  /** Whether subscription is renewed automatically at the end of each period. */
  autoRenewal: boolean;
  /** Number of billing cycles before subscription ends. Ignored if `autoRenewal: true`. */
  billingCycles: number | null;
}

/** Frequency unit of recurring payment */
export enum SubscriptionFrequency {
  UNDEFINED = 'UNDEFINED',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export interface Title {
  /** Subscription option name. */
  original: string;
  /** Translated subscription option name. */
  translated: string | null;
}

export interface Description {
  /** Subscription option description. */
  original: string;
  /** Translated subscription option name. */
  translated: string | null;
}

export interface SecuredMedia {
  /** Media ID in media manager. */
  id: string;
  /** Original file name. */
  fileName: string;
  /** File type. */
  fileType: FileType;
}

export enum FileType {
  UNSPECIFIED = 'UNSPECIFIED',
  SECURE_PICTURE = 'SECURE_PICTURE',
  SECURE_VIDEO = 'SECURE_VIDEO',
  SECURE_DOCUMENT = 'SECURE_DOCUMENT',
  SECURE_MUSIC = 'SECURE_MUSIC',
  SECURE_ARCHIVE = 'SECURE_ARCHIVE',
}

/** Type of selected payment option for catalog item */
export enum PaymentOptionType {
  /** The entire payment for given item will happen as part of the checkout. */
  FULL_PAYMENT_ONLINE = 'FULL_PAYMENT_ONLINE',
  /** The entire payment for given item will happen after the checkout. */
  FULL_PAYMENT_OFFLINE = 'FULL_PAYMENT_OFFLINE',
  /** Given item cannot be paid via monetary payment options, only via membership. When this option is used, price will always be 0. */
  MEMBERSHIP = 'MEMBERSHIP',
  /**
   * Partial payment for the given item to be paid upfront during the checkout.
   * Amount to be paid is defined by `deposit_amount`` field on per-item basis.
   */
  DEPOSIT_ONLINE = 'DEPOSIT_ONLINE',
}

export interface ServiceProperties {
  /** Optional - The date and time for which the service is supposed to be provided. For example, the time of the class. */
  scheduledDate: Date;
  /** Optional - The number of people participating in this service. For example, the number of people attending the class or the number of people per hotel room. */
  numberOfParticipants: number | null;
}

export interface PriceDescription {
  /** *Required** - Original price description (in site's default language). */
  original: string;
  /** Optional - Translated product name according to buyer language. Defaults to `original` when not provided. */
  translated: string | null;
}

/** Physical address */
export interface Address {
  /** Two-letter country code in [ISO-3166 alpha-2](https://www.iso.org/obp/ui/#search/code/) format. */
  country: string | null;
  /** Code for a subdivision (such as state, prefecture, or province) in [ISO 3166-2](https://www.iso.org/standard/72483.html) format. */
  subdivision: string | null;
  /** City name. */
  city: string | null;
  /** Postal or zip code. */
  postalCode: string | null;
  /** Street address object, with number, name, and apartment number in separate fields. */
  streetAddress: StreetAddress;
  /** Main address line (usually street name and number). */
  addressLine: string | null;
  /** Free text providing more detailed address info. Usually contains apt, suite, floor. */
  addressLine2: string | null;
  /**
   * Country's full name.
   * @readonly
   */
  countryFullname: string | null;
  /**
   * Subdivision full-name.
   * @readonly
   */
  subdivisionFullname: string | null;
}

export interface StreetAddress {
  /** Street number. */
  number: string;
  /** Street name. */
  name: string;
  /**
   * Apartment number.
   * @internal
   */
  apt: string;
}


/**
 * Extend core cart types
 */

export type Cart = Core.Cart & {
  lineItems: Core.LineItem[]
  url?: string
}

export type CartTypes = Core.CartTypes

export type CartHooks = Core.CartHooks<CartTypes>

export type GetCartHook = CartHooks['getCart']
export type AddItemHook = CartHooks['addItem']
export type UpdateItemHook = CartHooks['updateItem']
export type RemoveItemHook = CartHooks['removeItem']
