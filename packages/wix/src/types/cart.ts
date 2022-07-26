import * as Core from '@vercel/commerce/types/cart'

export * from '@vercel/commerce/types/cart'

export interface WixCart {
  /** Cart ID. */
  id: string;
  /**
   * Line items.
   * @readonly
   */
  lineItems: WixCartLineItem[];
  /** [Buyer note](https://support.wix.com/en/article/wix-stores-viewing-buyer-notes) left by the customer. */
  buyerNote: string | null;
  /**
   * Buyer information.
   * @readonly
   */
  buyerInfo: BuyerInfo;
  /**
   * Currency used for pricing.
   * @readonly
   */
  currency: string;
  /**
   * All the converted prices are presented in this currency.
   * @readonly
   */
  conversionCurrency: string;
  /**
   * Language for communication with the buyer. Defaults to the site language.
   * For a site that supports multiple languages, this is the language the buyer selected.
   * @readonly
   */
  buyerLanguage: string | null;
  /**
   * Site language in which original values are shown.
   * @readonly
   */
  siteLanguage: string | null;
  /**
   * Whether tax is included in line item prices.
   * @readonly
   */
  taxIncludedInPrices: boolean;
  /**
   * Weight measurement unit - defaults to site's weight unit.
   * @readonly
   */
  weightUnit: WeightUnit;
  /**
   * Combined price of all line items before discounts. Subtotal includes tax if line item prices in the catalog include tax.
   * @internal
   * @readonly
   */
  subtotal: MultiCurrencyPrice;
  /**
   * ID of the checkout related to this cart.
   * @readonly
   */
  checkoutId: string | null;
  /**
   * Cart discounts.
   * @readonly
   */
  appliedDiscounts: CartDiscount[];
  /**
   * this field is needed for smooth rollout only
   * @internal
   */
  inSync: boolean | null;
  /**
   * Date and time the cart was created.
   * @readonly
   */
  createdDate: string;
  /**
   * Date and time the cart was updated.
   * @readonly
   */
  updatedDate: string;
  /** Contact details. */
  contactDetails: AddressWithContact;
}

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

/** Buyer Info */
export interface BuyerInfo extends BuyerInfoIdOneOf {
  /**
   * Contact ID. Auto-created if one does not yet exist. For more information, see [Contacts API](https://dev.wix.com/api/rest/contacts/contacts/introduction).
   * @readonly
   */
  contactId: string | null;
  /** Visitor ID - if the buyer is **not** a site member. */
  visitorId: string;
  /** Member ID - if the buyer is a site member. */
  memberId: string;
  /** User ID - if the cart owner is a Wix user. */
  userId: string;
}

/** @oneof */
export interface BuyerInfoIdOneOf {
  /** Visitor ID - if the buyer is **not** a site member. */
  visitorId: string;
  /** Member ID - if the buyer is a site member. */
  memberId: string;
  /** User ID - if the cart owner is a Wix user. */
  userId: string;
}

export enum WeightUnit {
  /** Weight unit can't be classified, due to an error */
  UNSPECIFIED_WEIGHT_UNIT = 'UNSPECIFIED_WEIGHT_UNIT',
  /** Kilograms */
  KG = 'KG',
  /** Pounds */
  LB = 'LB',
}

export interface CartDiscount extends CartDiscountDiscountSourceOneOf {
  /** Coupon details. */
  coupon: V1Coupon;
  /** Merchant discount. */
  merchantDiscount: V1MerchantDiscount;
}

/** @oneof */
export interface CartDiscountDiscountSourceOneOf {
  /** Coupon details. */
  coupon: V1Coupon;
  /** Merchant discount. */
  merchantDiscount: V1MerchantDiscount;
}

export interface V1Coupon {
  /** Coupon ID. */
  id: string;
  /** Coupon code. */
  code: string;
}

export interface V1MerchantDiscount {
  /** Discount value. */
  amount: MultiCurrencyPrice;
}

/** Billing Info and shipping details */
export interface AddressWithContact {
  /** Address. */
  address: Address;
  /** Contact details. */
  contactDetails: ApiFullAddressContactDetails;
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

/** Full contact details for an address */
export interface ApiFullAddressContactDetails {
  /** First name. */
  firstName: string | null;
  /** Last name. */
  lastName: string | null;
  /** Phone number. */
  phone: string | null;
  /** Company name. */
  company: string | null;
  /** Tax information (for Brazil only). If ID is provided, `vatId.type` must also be set - UNSPECIFIED is not allowed. */
  vatId: VatId;
}

export interface VatId {
  /** Customer's tax ID */
  id: string;
  /** tax type */
  type: VatType;
}

/** tax info types */
export enum VatType {
  UNSPECIFIED = 'UNSPECIFIED',
  /** CPF - for individual tax payers */
  CPF = 'CPF',
  /** CNPJ - for corporations */
  CNPJ = 'CNPJ',
}

export interface AddToCartResponse {
  /** Updated cart. */
  cart: WixCart;
}

export interface RemoveLineItemsResponse {
  /** Updated cart. */
  cart: WixCart;
}

export interface SelectedShippingOption {
  /** Carrier ID. */
  carrierId: string | null;
  /** Selected shipping option code. For example, "usps_std_overnight". */
  code: string;
}

export interface CreateCheckoutResponse {
  /** The newly created checkout's ID. */
  checkoutId: string;
}

export interface UpdateLineItemsQuantityResponse {
  /** Updated cart. */
  cart: WixCart;
}

export interface SelectedMemberships {
  /** Selected memberships. */
  memberships: SelectedMembership[];
}

export interface SelectedMembership {
  /** Membership ID. */
  id: string;
  /** ID of the app providing this payment option. */
  appId: string;
  /** IDs of the line items this membership applies to. */
  lineItemIds: string[];
}

export interface CreateCartResponse {
  /** Cart. */
  cart: WixCart;
}

export interface GetCartResponse {
  /** The requested cart. */
  cart: WixCart;
}

export interface GetCurrentCartResponse {
  /** Current session's active cart. */
  cart: WixCart;
}

export interface EstimateTotalsRequest {
  /** Cart ID. */
  id: string;
  /** Selected shipping option. */
  selectedShippingOption: SelectedShippingOption;
  /** Shipping address. Used for calculating tax and shipping (when applicable). */
  shippingAddress: Address;
  /** Billing address. Used for calculating tax if an item is not shippable. */
  billingAddress: Address;
  /** The selected payment options and which line items they apply to. */
  selectedMemberships: SelectedMemberships;
  /**
   * Whether to calculate tax in the calculation request. If not passed, tax is being calculated.
   * @internal
   */
  calculateTax: boolean | null;
  /**
   * Whether to calculate shipping in the calculation request. If not passed, shipping is being calculated.
   * @internal
   */
  calculateShipping: boolean | null;
}

export interface Empty {}

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
