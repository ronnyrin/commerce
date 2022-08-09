import { serializer, transformError } from '@wix/metro-runtime/velo';
import * as ambassadorWixEcomV1Cart from '@wix/ambassador-ecom-v1-cart/http';
import { RequestOptionsFactory } from '@wix/http-client'

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
const _toVeloEntity = '$';
const _fromVeloEntity = '$';

export interface Cart {
  /** Cart ID. */
  _id?: string | null;
  /**
   * Line items.
   * @readonly
   */
  lineItems?: LineItem[];
  /** [Buyer note](https://support.wix.com/en/article/wix-stores-viewing-buyer-notes) left by the customer. */
  buyerNote?: string | null;
  /**
   * Buyer information.
   * @readonly
   */
  buyerInfo?: BuyerInfo;
  /**
   * Currency used for pricing.
   * @readonly
   */
  currency?: string;
  /**
   * All the converted prices are presented in this currency.
   * @readonly
   */
  conversionCurrency?: string;
  /**
   * Language for communication with the buyer. Defaults to the site language.
   * For a site that supports multiple languages, this is the language the buyer selected.
   * @readonly
   */
  buyerLanguage?: string | null;
  /**
   * Site language in which original values are shown.
   * @readonly
   */
  siteLanguage?: string | null;
  /**
   * Whether tax is included in line item prices.
   * @readonly
   */
  taxIncludedInPrices?: boolean | null;
  /**
   * Weight measurement unit - defaults to site's weight unit. Supported values:
   * + `"KG"`
   * + `"LB"`
   * @readonly
   */
  weightUnit?: WeightUnit;
  /**
   * Combined price of all line items before discounts. Subtotal includes tax if line item prices in the catalog include tax.
   * @internal
   * @readonly
   */
  subtotal?: MultiCurrencyPrice;
  /**
   * ID of the checkout related to this cart.
   * @readonly
   */
  checkoutId?: string | null;
  /**
   * Cart discounts.
   * @readonly
   */
  appliedDiscounts?: CartDiscount[];
  /**
   * this field is needed for smooth rollout only
   * @internal
   */
  inSync?: boolean | null;
  /**
   * Date and time the cart was created.
   * @readonly
   */
  _createdDate?: Date;
  /**
   * Date and time the cart was updated.
   * @readonly
   */
  _updatedDate?: Date;
  /** Contact info. */
  contactInfo?: AddressWithContact;
}

export interface LineItem {
  /** Line item ID. */
  _id?: string | null;
  /** Item quantity. */
  quantity?: number;
  /** Catalog and item reference. Holds IDs for the item and the catalog it came from, as well as further optional info. */
  catalogReference?: CatalogReference;
  /**
   * Item name.
   * + Stores - `product.name`
   * + Bookings - `service.info.name`
   * + Events - `ticket.name`
   * @readonly
   */
  productName?: ProductName;
  /**
   * URL to the item's page on the site.
   * @readonly
   */
  url?: string;
  /**
   * Item price **after** catalog-defined discount and line item discounts.
   * @readonly
   */
  price?: MultiCurrencyPrice;
  /**
   * Item price **before** catalog-defined discount. Defaults to `price` when not provided.
   * @readonly
   */
  fullPrice?: MultiCurrencyPrice;
  /**
   * Item price **before** line item discounts and **after** catalog-defined discount. Defaults to `price` when not provided.
   * @readonly
   */
  priceBeforeDiscounts?: MultiCurrencyPrice;
  /**
   * Line item description lines. Used for displaying the cart, checkout and order.
   * @readonly
   */
  descriptionLines?: DescriptionLine[];
  /**
   * Line item image details.
   * @readonly
   */
  image?: string;
  /**
   * Item availability details.
   * @readonly
   */
  availability?: ItemAvailabilityInfo;
  /**
   * Physical properties of the item. When relevant, contains information such as SKU, item weight, and shippability.
   * @readonly
   */
  physicalProperties?: PhysicalProperties;
  /**
   * Coupon scopes - which app and items a coupon applies to.
   * This field is internal to Wix, and should be used by Bookings, Stores and Events as used by the current [Coupons API](https://bo.wix.com/wix-docs/rest/stores/coupons/valid-scope-values).
   * @internal
   * @readonly
   */
  couponScopes?: Scope[];
  /**
   * Item type. Either a preset type or custom.
   * @readonly
   */
  itemType?: ItemType;
  /**
   * Subscription option information.
   * @internal
   * @readonly
   */
  subscriptionOptionInfo?: SubscriptionOptionInfo;
  /**
   * Digital file identifier, relevant only for items with type DIGITAL.
   * @internal
   * @readonly
   */
  digitalFile?: SecuredMedia;
  /**
   * Type of selected payment option for current item. Defaults to `"FULL_PAYMENT_ONLINE"`.
   * + `"FULL_PAYMENT_ONLINE"` - The entire payment for this item happens as part of the checkout.
   * + `"FULL_PAYMENT_OFFLINE"` - The entire payment for this item happens after the checkout. For example, when using cash, check, or other offline payment methods.
   * + `"MEMBERSHIP"` - Payment for this item is done by charging a membership. When this option is used, `lineItem.price.amount` will be 0.
   * @readonly
   */
  paymentOption?: PaymentOptionType;
  /**
   * Service properties. When relevant, this contains information such as date and number of participants.
   * @readonly
   */
  serviceProperties?: ServiceProperties;
  /**
   * In cases where `catalogReference.catalogItemId` is NOT the actual catalog item ID, this field will return the true item's ID.
   * + For example, for Wix Bookings, `catalogReference.catalogItemId` is the booking ID. Therefore this value is set to the service ID.
   * + in most cases, this field is the name as `catalogReference.catalogItemId`.
   * + Used in membership validation.
   * @readonly
   */
  rootCatalogItemId?: string | null;
  /**
   * Additional description for the price. For example, when price is 0 but additional details about the actual price are needed - "Starts at $67".
   * @readonly
   */
  priceDescription?: PriceDescription;
}

/** Used for grouping line items and is sent on add to cart */
export interface CatalogReference {
  /** ID of the item within its catalog. For example, `productId` for Wix Stores. */
  catalogItemId?: string;
  /** App ID of the catalog the item comes from. For example, the Wix Stores `appId` is `"1380b703-ce81-ff05-f115-39571d94dfcd"`. */
  appId?: string;
  /**
   * Additional info in key:value form. For example, for a product variant from Wix Stores Catalog, `options` field would hold something like one of the following:
   * + `{"Size": "M", "Color": "Red"}`
   * + `{"variantId": "<VARIANT_ID>"}`.
   */
  options?: Record<string, any> | null;
}

export interface ProductName {
  /** **Required** - Original product name (in site's default language). */
  original?: string;
  /** Description product name translated into buyer's language. Defaults to `original` when not defined. */
  translated?: string | null;
}

export interface MultiCurrencyPrice {
  /** Amount. */
  amount?: string;
  /**
   * Converted amount.
   * @readonly
   */
  convertedAmount?: string;
  /**
   * Amount formatted with currency symbol.
   * @readonly
   */
  formattedAmount?: string;
  /**
   * Converted amount formatted with currency symbol.
   * @readonly
   */
  formattedConvertedAmount?: string;
}

export interface DescriptionLine
  extends DescriptionLineValueOneOf,
    DescriptionLineDescriptionLineValueOneOf {
  /** Description line name. */
  name?: DescriptionLineName;
  /**
   * Description line type.
   * @internal
   */
  lineType?: DescriptionLineType;
  /** Description line plain text value. */
  plainText?: PlainTextValue;
  /** Description line color value. */
  colorInfo?: Color;
  /**
   * Description line plain text value.
   * @internal
   */
  plainTextValue?: PlainTextValue;
  /**
   * Description line color.
   * @internal
   */
  color?: string;
}

/** @oneof */
export interface DescriptionLineValueOneOf {
  /** Description line plain text value. */
  plainText?: PlainTextValue;
  /** Description line color value. */
  colorInfo?: Color;
}

/** @oneof */
export interface DescriptionLineDescriptionLineValueOneOf {
  /**
   * Description line plain text value.
   * @internal
   */
  plainTextValue?: PlainTextValue;
  /**
   * Description line color.
   * @internal
   */
  color?: string;
}

export interface DescriptionLineName {
  /** Description line name in site's default language. */
  original?: string;
  /** Description line name translated into buyer's language. Defaults to `original` when not defined. */
  translated?: string | null;
}

export interface PlainTextValue {
  /** Description line plain text value in site's default language. */
  original?: string;
  /** Description line plain text value translated into buyer's language. Defaults to `original` when not defined. */
  translated?: string | null;
}

export interface Color {
  /** Description line color name in site's default language. */
  original?: string;
  /** Description line color name translated into buyer's language. Defaults to `original` when not defined. */
  translated?: string | null;
  /**
   * HEX or RGB color code for display.
   *
   */
  code?: string | null;
}

export enum DescriptionLineType {
  UNRECOGNISED = 'UNRECOGNISED',
  PLAIN_TEXT = 'PLAIN_TEXT',
  COLOR = 'COLOR',
}

export interface ItemAvailabilityInfo {
  /**
   * Item availability status.
   *
   * NOT_FOUND - Item does not exist.
   * NOT_AVAILABLE - Not in stock.
   * PARTIALLY_AVAILABLE - Available quantity is less than requested.
   */
  status?: ItemAvailabilityStatus;
  /** Quantity available. */
  quantityAvailable?: number | null;
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
  /**
   * Line item weight. Measurement unit is taken from `order.weightUnit`. Supported values:
   * + `"KG"`
   * + `"LB"`
   */
  weight?: number | null;
  /** Stock-keeping unit. Learn more about [SKUs](https://www.wix.com/encyclopedia/definition/stock-keeping-unit-sku). */
  sku?: string | null;
  /** Whether this line item is shippable. */
  shippable?: boolean;
}

export interface Scope {
  /** Scope namespace (Wix Stores, Wix Bookings, Wix Events) */
  namespace?: string;
  /** Coupon scope's applied group (e.g., event or ticket in Wix Events) */
  group?: Group;
}

export interface Group {
  /** Coupon scope's group (e.g., product or collection in Wix Stores). See [valid scope values](https://dev.wix.com/api/rest/coupons/coupons/valid-scope-values). */
  name?: string;
  /** Item ID (when the coupon scope is limited to just one item). */
  entityId?: string | null;
}

export interface ItemType extends ItemTypeItemTypeDataOneOf {
  /** Preset item type. */
  preset?: ItemTypeItemType;
  /** Custom item type. */
  custom?: string;
}

/** @oneof */
export interface ItemTypeItemTypeDataOneOf {
  /** Preset item type. */
  preset?: ItemTypeItemType;
  /** Custom item type. */
  custom?: string;
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
  subscriptionSettings?: SubscriptionSettings;
  /** Subscription option title. */
  title?: Title;
  /** Subscription option description. */
  description?: Description;
}

export interface SubscriptionSettings {
  /** Frequency of recurring payment. */
  frequency?: SubscriptionFrequency;
  /**
   * Interval of recurring payment (optional: default value 1 will be used if not provided, other values are not supported yet)
   * @internal
   */
  interval?: number | null;
  /** Whether subscription is renewed automatically at the end of each period. */
  autoRenewal?: boolean;
  /** Number of billing cycles before subscription ends. Ignored if `autoRenewal: true`. */
  billingCycles?: number | null;
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
  original?: string;
  /** Translated subscription option name. */
  translated?: string | null;
}

export interface Description {
  /** Subscription option description. */
  original?: string;
  /** Translated subscription option name. */
  translated?: string | null;
}

export interface SecuredMedia {
  /** Media ID in media manager. */
  _id?: string;
  /** Original file name. */
  fileName?: string;
  /** File type. */
  fileType?: FileType;
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
   * Amount to be paid is defined by `deposit_amount` field on per-item basis.
   */
  DEPOSIT_ONLINE = 'DEPOSIT_ONLINE',
}

export interface ServiceProperties {
  /** The date and time for which the service is supposed to be provided. For example, the time of the class. */
  scheduledDate?: Date;
  /** The number of people participating in this service. For example, the number of people attending the class or the number of people per hotel room. */
  numberOfParticipants?: number | null;
}

export interface PriceDescription {
  /**
   * **Required** - Original price description (in site's default language).
   *
   */
  original?: string;
  /** Product name translated into buyer's language. Defaults to `original` when not defined. */
  translated?: string | null;
}

/** Buyer Info */
export interface BuyerInfo extends BuyerInfoIdOneOf {
  /**
   * Contact ID. Auto-created if one does not yet exist. For more information, see the [Contacts API](https://www.wix.com/velo/reference/wix-crm-backend/contacts/introduction).
   * @readonly
   */
  contactId?: string | null;
  /** Visitor ID - if the buyer is **not** a site member. */
  visitorId?: string;
  /** Member ID - if the buyer is a site member. */
  memberId?: string;
  /** User ID - if the cart owner is a Wix user. */
  userId?: string;
}

/** @oneof */
export interface BuyerInfoIdOneOf {
  /** Visitor ID - if the buyer is **not** a site member. */
  visitorId?: string;
  /** Member ID - if the buyer is a site member. */
  memberId?: string;
  /** User ID - if the cart owner is a Wix user. */
  userId?: string;
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
  coupon?: Coupon;
  /** Merchant discount. */
  merchantDiscount?: MerchantDiscount;
}

/** @oneof */
export interface CartDiscountDiscountSourceOneOf {
  /** Coupon details. */
  coupon?: Coupon;
  /** Merchant discount. */
  merchantDiscount?: MerchantDiscount;
}

export interface Coupon {
  /** Coupon ID. */
  _id?: string;
  /** Coupon code. */
  code?: string;
}

export interface MerchantDiscount {
  /** Discount value. */
  amount?: MultiCurrencyPrice;
}

/** Billing Info and shipping details */
export interface AddressWithContact {
  /** Address. */
  address?: Address;
  /** Contact details. */
  contactDetails?: ApiFullAddressContactDetails;
}

/** Physical address */
export interface Address {
  /** Two-letter country code in [ISO-3166 alpha-2](https://www.iso.org/obp/ui/#search/code/) format. */
  country?: string | null;
  /** Code for a subdivision (such as state, prefecture, or province) in [ISO 3166-2](https://www.iso.org/standard/72483.html) format. */
  subdivision?: string | null;
  /** City name. */
  city?: string | null;
  /** Postal or zip code. */
  postalCode?: string | null;
  /** Street address object, with number, name, and apartment number in separate fields. */
  streetAddress?: StreetAddress;
  /** Main address line (usually street name and number). */
  addressLine?: string | null;
  /** Free text providing more detailed address info. Usually contains apt, suite, floor. */
  addressLine2?: string | null;
  /**
   * Country's full name.
   * @readonly
   */
  countryFullname?: string | null;
  /**
   * Subdivision full-name.
   * @readonly
   */
  subdivisionFullname?: string | null;
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

/** Full contact details for an address */
export interface ApiFullAddressContactDetails {
  /** First name. */
  firstName?: string | null;
  /** Last name. */
  lastName?: string | null;
  /** Phone number. */
  phone?: string | null;
  /** Company name. */
  company?: string | null;
  /** Tax information (for Brazil only). If ID is provided, `vatId.type` must also be set - UNSPECIFIED is not allowed. */
  vatId?: VatId;
}

export interface VatId {
  /** Customer's tax ID */
  _id?: string;
  /** tax type */
  type?: VatType;
}

/** tax info types */
export enum VatType {
  UNSPECIFIED = 'UNSPECIFIED',
  /** CPF - for individual tax payers */
  CPF = 'CPF',
  /** CNPJ - for corporations */
  CNPJ = 'CNPJ',
}

export interface UpdateCartRequest {
  /** Cart info. */
  cartInfo?: Cart;
  /** The code of an existing coupon to apply to the cart. For more information, see the [Coupons API](https://www.wix.com/velo/reference/wix-marketing-backend/coupons). */
  couponCode?: string | null;
  /** Merchant discounts to apply to specific line items. If no `lineItemIds` are passed, the discount will be applied to the whole cart. */
  merchantDiscounts?: MerchantDiscountInput[];
  /** Catalog line items. */
  lineItems?: LineItem[];
  /** Custom line items. */
  customLineItems?: CustomLineItem[];
  /**
   * List of field names to determine which of cartInfo's fields will be updated
   * @internal
   */
  cartFieldmask?: string[];
}

export interface MerchantDiscountInput {
  /** Discount amount. */
  amount?: string;
  /** IDs of the line items the discount applies to. */
  lineItemIds?: string[];
}

export interface CustomLineItem {
  /** Custom line item quantity. */
  quantity?: number;
  /** Custom line item name. */
  name?: string | null;
  /** Custom line item price. */
  price?: string;
  /** Custom line item description lines. Used for displaying the cart, checkout and order. */
  descriptionLines?: DescriptionLine[];
  /**
   * Custom line item media. Supported formats:
   * + Link to an image/video from the [Wix Media Manager](https://support.wix.com/en/article/wix-media-about-the-media-manager) - `"wix:image://v1/3c76e2_c53...4ea4~mv2.jpg#originWidth=1000&originHeight=1000"`.
   * + An image from the web - `"http(s)://<image url>"`.
   */
  media?: string;
  /** Custom line item ID. Defaults to an auto-generated ID. */
  _id?: string | null;
}

export interface UpdateCartResponse {
  /** Updated Cart. */
  cart?: Cart;
}

export interface AddToCurrentCartRequest {
  /** Catalog line items. */
  lineItems?: LineItem[];
  /** Custom line items. */
  customLineItems?: CustomLineItem[];
}

export interface AddToCartResponse {
  /** Updated cart. */
  cart?: Cart;
}

export interface RemoveLineItemsFromCurrentCartRequest {
  /** IDs of the line items to remove from the cart. */
  lineItemIds: string[];
}

export interface RemoveLineItemsResponse {
  /** Updated cart. */
  cart?: Cart;
}

export interface CreateCheckoutFromCurrentCartRequest {
  /**
   * Sales channel type. Supported values:
   * + `"AMAZON"`
   * + `"BACKOFFICE_MERCHANT"`
   * + `"EBAY"`
   * + `"OTHER_PLATFORM"`
   * + `"POS"`
   * + `"WEB"`
   * + `"WISH"`
   * + `"WIX_APP_STORE"`
   * + `"WIX_INVOICES"`
   */
  channelType?: ChannelType;
  /** Shipping address. Used for calculating tax and shipping (when applicable). */
  shippingAddress?: Address;
  /** Billing address. Used for calculating tax if all the items in the cart are not shippable. */
  billingAddress?: Address;
  /** Selected shipping option. */
  selectedShippingOption?: SelectedShippingOption;
  /** Mandatory when setting a billing or shipping address if the site visitor isn't logged in. */
  email?: string | null;
}

export enum ChannelType {
  UNSPECIFIED = 'UNSPECIFIED',
  WEB = 'WEB',
  POS = 'POS',
  EBAY = 'EBAY',
  AMAZON = 'AMAZON',
  OTHER_PLATFORM = 'OTHER_PLATFORM',
  WIX_APP_STORE = 'WIX_APP_STORE',
  WIX_INVOICES = 'WIX_INVOICES',
  BACKOFFICE_MERCHANT = 'BACKOFFICE_MERCHANT',
  WISH = 'WISH',
}

export interface SelectedShippingOption {
  /** Carrier ID. */
  carrierId?: string | null;
  /** Selected shipping option code. For example, "usps_std_overnight". */
  code?: string;
}

export interface CreateCheckoutResponse {
  /** The newly created checkout's ID. */
  checkoutId?: string;
}

export interface RemoveCouponFromCurrentCartRequest {}

export interface RemoveCouponResponse {
  /** Updated cart. */
  cart?: Cart;
}

export interface UpdateCurrentCartLineItemQuantityRequest {
  /** Line item IDs and their new quantity. */
  lineItems: LineItemQuantityUpdate[];
}

export interface LineItemQuantityUpdate {
  /** Line item ID. */
  _id?: string;
  /** New quantity. Number must 1 or higher. */
  quantity?: number;
}

export interface UpdateLineItemsQuantityResponse {
  /** Updated cart. */
  cart?: Cart;
}

export interface EstimateCurrentCartTotalsRequest {
  /** Selected shipping option. */
  selectedShippingOption?: SelectedShippingOption;
  /** Shipping address. Used for calculating tax and shipping (when applicable). */
  shippingAddress?: Address;
  /** Billing address. Used for calculating tax if all the items in the cart are not shippable. */
  billingAddress?: Address;
  /** The selected membership payment options and which line items they apply to. */
  selectedMemberships?: SelectedMemberships;
  /**
   * Whether to calculate tax in the calculation request. If not passed, tax is being calculated.
   * @internal
   */
  calculateTax?: boolean | null;
  /**
   * Whether to calculate shipping in the calculation request. If not passed, shipping is being calculated.
   * @internal
   */
  calculateShipping?: boolean | null;
}

export interface SelectedMemberships {
  /** Selected memberships. */
  memberships?: SelectedMembership[];
}

export interface SelectedMembership {
  /** Membership ID. */
  _id?: string;
  /** ID of the app providing this payment option. */
  appId?: string;
  /** IDs of the line items this membership applies to. */
  lineItemIds?: string[];
}

export interface EstimateTotalsResponse {
  /** Cart. */
  cart?: Cart;
  /** Calculated line items. */
  calculatedLineItems?: CalculatedLineItem[];
  /** Price summary. */
  priceSummary?: PriceSummary;
  /** Applied gift card. */
  giftCard?: GiftCard;
  /** Tax summary. */
  taxSummary?: TaxSummary;
  /** Shipping information. */
  shippingInfo?: ShippingInformation;
  /** Applied discounts. */
  appliedDiscounts?: AppliedDiscount[];
  /** Calculation errors. */
  calculationErrors?: CalculationErrors;
  /**
   * Weight measurement unit - defaults to site's weight unit. Supported values:
   * + `"KG"`
   * + `"LB"`
   */
  weightUnit?: WeightUnit;
  /** Currency used for pricing in this store. */
  currency?: string;
  /**
   * Minimal amount to pay in order to place the order.
   * @readonly
   */
  payNow?: PriceSummary;
  /**
   * Remaining amount for the order to be fully paid.
   * @readonly
   */
  payLater?: PriceSummary;
  /** Information about valid and invalid memberships, and which ones are selected for usage. */
  membershipOptions?: MembershipOptions;
  /** Additional fees */
  additionalFees?: AdditionalFee[];
}

export interface CalculatedLineItem {
  /** Line item ID. */
  lineItemId?: string;
  /** Price breakdown for this line item. */
  pricesBreakdown?: LineItemPricesData;
  /**
   * Type of selected payment option for current item. Defaults to `"FULL_PAYMENT_ONLINE"`.
   * + `"FULL_PAYMENT_ONLINE"` - The entire payment for this item happens as part of the checkout.
   * + `"FULL_PAYMENT_OFFLINE"` - The entire payment for this item happens after the checkout. For example, when using cash, check, or other offline payment methods.
   * + `"MEMBERSHIP"` - Payment for this item is done by charging a membership. When this option is used, `lineItem.price.amount` will be 0.
   */
  paymentOption?: PaymentOptionType;
}

export interface LineItemPricesData {
  /** Total price after discounts and after tax. */
  totalPriceAfterTax?: MultiCurrencyPrice;
  /** Total price after discounts, before tax. */
  totalPriceBeforeTax?: MultiCurrencyPrice;
  /** Tax details. */
  taxDetails?: ItemTaxFullDetails;
  /** Total discount for all line items. */
  totalDiscount?: MultiCurrencyPrice;
  /** Catalog price after catalog discount and automatic discounts. */
  price?: MultiCurrencyPrice;
  /** Item price **before** line item discounts and **after** catalog-defined discount. Defaults to `price` when not provided. */
  priceBeforeDiscounts?: MultiCurrencyPrice;
  /** Total price **after** catalog-defined discount and line item discounts. */
  lineItemPrice?: MultiCurrencyPrice;
}

export interface ItemTaxFullDetails {
  /** Amount for which tax is calculated. */
  taxableAmount?: MultiCurrencyPrice;
  /**
   * Tax group ID, if specified.
   * @internal
   */
  taxGroupId?: string | null;
  /** Tax rate %, as a decimal point between 0 and 1. */
  taxRate?: string;
  /** Calculated tax, based on `taxable_amount` and `tax_rate`. */
  totalTax?: MultiCurrencyPrice;
  /**
   * If breakdown exists, the sum of rates in the breakdown must equal `tax_rate`.
   * @readonly
   */
  rateBreakdown?: TaxRateBreakdown[];
}

export interface TaxRateBreakdown {
  /** Type of tax against which the calculation was performed. */
  name?: string;
  /** Rate at which this tax detail was calculated. */
  rate?: string;
  /** Amount of tax for this tax detail. */
  tax?: MultiCurrencyPrice;
}

export interface PriceSummary {
  /** Subtotal of all line items, before discounts and before tax. */
  subtotal?: MultiCurrencyPrice;
  /** Total shipping price, before discounts and before tax. */
  shipping?: MultiCurrencyPrice;
  /** Total tax. */
  tax?: MultiCurrencyPrice;
  /** Total calculated discount value. */
  discount?: MultiCurrencyPrice;
  /** Total price after discounts, gift cards, and tax. */
  total?: MultiCurrencyPrice;
  /** Total additional fees price. */
  additionalFees?: MultiCurrencyPrice;
}

export interface GiftCard {
  /** Gift Card ID. */
  _id?: string;
  /** Gift card obfuscated code. */
  obfuscatedCode?: string;
  /** Gift card value. */
  amount?: MultiCurrencyPrice;
  /** App ID of the gift card provider. */
  appId?: string;
}

export interface TaxSummary {
  /**
   * Amount for which tax is calculated, added from line items.
   * @readonly
   */
  taxableAmount?: MultiCurrencyPrice;
  /**
   * Calculated tax, added from line items.
   * @readonly
   */
  totalTax?: MultiCurrencyPrice;
  /**
   * manual tax rate
   * @internal
   * @readonly
   */
  manualTaxRate?: string;
  /** Tax calculator that was active when the order was created. */
  calculationDetails?: TaxCalculationDetails;
}

export interface TaxCalculationDetails
  extends TaxCalculationDetailsCalculationDetailsOneOf {
  /**
   * Rate calculation type. Supported values:
   * + `"AUTO_RATE"`
   * + `"FALLBACK_RATE"`
   * + `"MANUAL_RATE"`
   * + `"NO_TAX_COLLECTED"`
   */
  rateType?: RateType;
  /** Reason the manual calculation was used. */
  manualRateReason?: ManualCalculationReason;
  /** Error details and reason for tax rate fallback. */
  autoTaxFallbackDetails?: AutoTaxFallbackCalculationDetails;
}

/** @oneof */
export interface TaxCalculationDetailsCalculationDetailsOneOf {
  /** Reason the manual calculation was used. */
  manualRateReason?: ManualCalculationReason;
  /** Details of the fallback rate calculation. */
  autoTaxFallbackDetails?: AutoTaxFallbackCalculationDetails;
}

export enum RateType {
  /** no tax being collected for this request due to location of purchase */
  NO_TAX_COLLECTED = 'NO_TAX_COLLECTED',
  /** manual rate used for calculation */
  MANUAL_RATE = 'MANUAL_RATE',
  /** autotax rate used for calculation */
  AUTO_RATE = 'AUTO_RATE',
  /** fallback rate used for calculation */
  FALLBACK_RATE = 'FALLBACK_RATE',
}

export enum ManualCalculationReason {
  /** user set calculator in Business Manager to be Manual */
  GLOBAL_SETTING_TO_MANUAL = 'GLOBAL_SETTING_TO_MANUAL',
  /** specific region is on manual even though Global setting is Auto-tax */
  REGION_SETTING_TO_MANUAL = 'REGION_SETTING_TO_MANUAL',
}

export interface AutoTaxFallbackCalculationDetails {
  /**
   * Reason for fallback. Supported values:
   * + `"AUTO_TAX_FAILED"`
   * + `"AUTO_TAX_DEACTIVATED"`
   */
  fallbackReason?: FallbackReason;
  /** invalid request (i.e. address), timeout, internal error, license error, and others will be encoded here */
  error?: ApplicationError;
}

export enum FallbackReason {
  /** auto-tax failed to be calculated */
  AUTO_TAX_FAILED = 'AUTO_TAX_FAILED',
  /** auto-tax was temporarily deactivated on a system-level */
  AUTO_TAX_DEACTIVATED = 'AUTO_TAX_DEACTIVATED',
}

export interface ApplicationError {
  code?: string;
  description?: string;
  data?: Record<string, any> | null;
}

export interface ShippingInformation {
  /** Shipping region. */
  region?: ShippingRegion;
  /** Selected shipping option. */
  selectedCarrierServiceOption?: SelectedCarrierServiceOption;
  /** All shipping options. */
  carrierServiceOptions?: CarrierServiceOption[];
}

export interface ShippingRegion {
  /**
   * Shipping region ID.
   * @readonly
   */
  _id?: string;
  /** Shipping region name. */
  name?: string;
}

export interface SelectedCarrierServiceOption {
  /** Unique identifier of selected option. For example, "usps_std_overnight". */
  code?: string;
  /**
   * Title of the option, such as USPS Standard Overnight Delivery (in the requested locale).
   * For example, "Standard" or "First-Class Package International".
   * @readonly
   */
  title?: string;
  /**
   * Delivery logistics.
   * @readonly
   */
  logistics?: DeliveryLogistics;
  /**
   * Shipping costs.
   * @readonly
   */
  cost?: SelectedCarrierServiceOptionPrices;
  /**
   * Were we able to find the requested shipping option, or otherwise we fallback to the default one (the first)
   * @readonly
   */
  requestedShippingOption?: boolean;
  /** Other charges */
  otherCharges?: SelectedCarrierServiceOptionOtherCharge[];
  /** This carrier's unique ID */
  carrierId?: string | null;
}

export interface DeliveryLogistics {
  /** Expected delivery time, in free text. For example, "3-5 business days". */
  deliveryTime?: string | null;
  /** Instructions for caller, e.g for pickup: "Please deliver during opening hours, and please don't park in disabled parking spot". */
  instructions?: string | null;
  /** Pickup details. */
  pickupDetails?: PickupDetails;
}

export interface PickupDetails {
  /** Pickup address. */
  address?: Address;
  /** Whether the pickup address is that of a business - this may effect tax calculation. */
  businessLocation?: boolean;
  /** Pickup method */
  pickupMethod?: PickupMethod;
}

export enum PickupMethod {
  UNKNOWN_METHOD = 'UNKNOWN_METHOD',
  STORE_PICKUP = 'STORE_PICKUP',
  PICKUP_POINT = 'PICKUP_POINT',
}

export interface SelectedCarrierServiceOptionPrices {
  /** Total shipping price, after discount and after tax. */
  totalPriceAfterTax?: MultiCurrencyPrice;
  /** Totals shipping price after discount and before tax. */
  totalPriceBeforeTax?: MultiCurrencyPrice;
  /** Tax details. */
  taxDetails?: ItemTaxFullDetails;
  /** Shipping discount before tax. */
  totalDiscount?: MultiCurrencyPrice;
  /** Shipping price before discount and before tax. */
  price?: MultiCurrencyPrice;
}

export interface SelectedCarrierServiceOptionOtherCharge {
  /** Type of additional cost. */
  type?: ChargeType;
  /** Details of the charge, such as 'Full Coverage Insurance of up to 80% of value of shipment'. */
  details?: string | null;
  /** Price of added charge. */
  cost?: SelectedCarrierServiceOptionPrices;
}

export enum ChargeType {
  HANDLING_FEE = 'HANDLING_FEE',
  INSURANCE = 'INSURANCE',
}

export interface CarrierServiceOption {
  /** Carrier ID. */
  carrierId?: string;
  /** Shipping options offered by this carrier for this request. */
  shippingOptions?: ShippingOption[];
}

export interface ShippingOption {
  /**
   * Unique code of provided shipping option like "usps_std_overnight".
   * For legacy calculators this would be the UUID of the option.
   */
  code?: string;
  /**
   * Title of the option, such as USPS Standard Overnight Delivery (in the requested locale).
   * For example, "Standard" or "First-Class Package International".
   */
  title?: string;
  /** Delivery logistics. */
  logistics?: DeliveryLogistics;
  /** Sipping price information. */
  cost?: ShippingPrice;
}

export interface ShippingPrice {
  /** Shipping price. */
  price?: MultiCurrencyPrice;
  /** Other costs such as insurance, handling & packaging for fragile items, etc. */
  otherCharges?: OtherCharge[];
}

export interface OtherCharge {
  /** Type of additional cost. */
  type?: ChargeType;
  /** Price of added cost. */
  price?: MultiCurrencyPrice;
}

export interface AppliedDiscount extends AppliedDiscountDiscountSourceOneOf {
  /** Discount type. */
  discountType?: DiscountType;
  /** IDs of the line items the discount applies to. */
  lineItemIds?: string[];
  /** Coupon details. */
  coupon?: V1Coupon;
  /** Merchant discount. */
  merchantDiscount?: V1MerchantDiscount;
  /** Discount rule */
  discountRule?: DiscountRule;
}

/** @oneof */
export interface AppliedDiscountDiscountSourceOneOf {
  /** Coupon details. */
  coupon?: V1Coupon;
  /** Merchant discount. */
  merchantDiscount?: V1MerchantDiscount;
  /** Discount rule */
  discountRule?: DiscountRule;
}

export enum DiscountType {
  GLOBAL = 'GLOBAL',
  SPECIFIC_ITEMS = 'SPECIFIC_ITEMS',
  SHIPPING = 'SHIPPING',
}

/** Coupon */
export interface V1Coupon {
  /** Coupon ID. */
  _id?: string;
  /** Coupon code. */
  code?: string;
  /** Coupon value. */
  amount?: MultiCurrencyPrice;
  /** Coupon name. */
  name?: string;
  /**
   * Coupon type: We want it to be an enum and not a string but currently we have no time to do it so we leave it as is to be aligned with cart summary.
   * @internal
   */
  couponType?: string;
}

export interface V1MerchantDiscount {
  /** Discount value. */
  amount?: MultiCurrencyPrice;
}

export interface DiscountRule {
  /** Discount rule ID */
  _id?: string;
  /** Discount rule name */
  name?: DiscountRuleName;
  /** Discount value. */
  amount?: MultiCurrencyPrice;
}

export interface DiscountRuleName {
  /** Original discount rule name (in site's default language). */
  original?: string;
  /** Discount rule name translated into buyer's language. Defaults to `original` when not defined. */
  translated?: string | null;
}

export interface CalculationErrors
  extends CalculationErrorsShippingCalculationErrorOneOf {
  /** Tax calculation error. */
  taxCalculationError?: Details;
  /** Coupon calculation error. */
  couponCalculationError?: Details;
  /** Gift card calculation error. */
  giftCardCalculationError?: Details;
  /** Order validation errors. */
  orderValidationErrors?: ApplicationError[];
  /**
   * Membership payment methods calculation errors
   * For example, will indicate that a line item that must be paid with membership payment doesn't have one or selected memberships are invalid
   */
  membershipError?: Details;
  /** Discount Rule calculation error. */
  discountsCalculationError?: Details;
  /** General shipping calculation error. */
  generalShippingCalculationError?: Details;
  /** Carrier errors. */
  carrierErrors?: CarrierErrors;
}

/** @oneof */
export interface CalculationErrorsShippingCalculationErrorOneOf {
  /** General shipping calculation error. */
  generalShippingCalculationError?: Details;
  /** Carrier errors. */
  carrierErrors?: CarrierErrors;
}

export interface Details extends DetailsKindOneOf {
  /** Deprecated in APIs. Used to enable migration from rendering arbitrary tracing to rest response. */
  tracing?: Record<string, string>;
  applicationError?: ApplicationError;
  validationError?: ValidationError;
}

/** @oneof */
export interface DetailsKindOneOf {
  applicationError?: ApplicationError;
  validationError?: ValidationError;
}

/**
 * example result:
 * {
 * "fieldViolations": [
 * {
 * "field": "fieldA",
 * "description": "invalid music note. supported notes: [do,re,mi,fa,sol,la,ti]",
 * "violatedRule": "OTHER",
 * "ruleName": "INVALID_NOTE",
 * "data": {
 * "value": "FI"
 * }
 * },
 * {
 * "field": "fieldB",
 * "description": "field value out of range. supported range: [0-20]",
 * "violatedRule": "MAX",
 * "data": {
 * "threshold": 20
 * }
 * },
 * {
 * "field": "fieldC",
 * "description": "invalid phone number. provide a valid phone number of size: [7-12], supported characters: [0-9, +, -, (, )]",
 * "violatedRule": "FORMAT",
 * "data": {
 * "type": "PHONE"
 * }
 * }
 * ]
 * }
 */
export interface ValidationError {
  fieldViolations?: FieldViolation[];
}

export enum RuleType {
  VALIDATION = 'VALIDATION',
  OTHER = 'OTHER',
  MAX = 'MAX',
  MIN = 'MIN',
  MAX_LENGTH = 'MAX_LENGTH',
  MIN_LENGTH = 'MIN_LENGTH',
  MAX_SIZE = 'MAX_SIZE',
  MIN_SIZE = 'MIN_SIZE',
  FORMAT = 'FORMAT',
  DECIMAL_LTE = 'DECIMAL_LTE',
  DECIMAL_GTE = 'DECIMAL_GTE',
  DECIMAL_LT = 'DECIMAL_LT',
  DECIMAL_GT = 'DECIMAL_GT',
  DECIMAL_MAX_SCALE = 'DECIMAL_MAX_SCALE',
  INVALID_ENUM_VALUE = 'INVALID_ENUM_VALUE',
  REQUIRED_FIELD = 'REQUIRED_FIELD',
}

export interface FieldViolation {
  field?: string;
  description?: string;
  violatedRule?: RuleType;
  /** applicable when violated_rule=OTHER */
  ruleName?: string | null;
  data?: Record<string, any> | null;
}

export interface CarrierErrors {
  /** Carrier errors. */
  errors?: CarrierError[];
}

export interface CarrierError {
  /** Carrier ID. */
  carrierId?: string;
  /** Error details. */
  error?: Details;
}

export interface MembershipOptions {
  /** List of payment options that can be used. */
  eligibleMemberships?: Membership[];
  /** List of payment options that are owned by the member, but cannot be used due to reason provided. */
  invalidMemberships?: InvalidMembership[];
  /** The selected membership payment options and which line items they apply to. */
  selectedMemberships?: SelectedMembership[];
}

export interface Membership {
  /** Membership ID. */
  _id?: string;
  /** ID of the application providing this payment option. */
  appId?: string;
  /** The name of this membership. */
  name?: MembershipName;
  /** Line item IDs which are "paid" for by this membership. */
  lineItemIds?: string[];
  /** Optional - For a membership that has limited credits, information about credit usage. */
  credits?: MembershipPaymentCredits;
  /** Optional - TMembership expiry date. */
  expirationDate?: Date;
  /** Additional data about this membership. */
  additionalData?: Record<string, any> | null;
}

export interface MembershipName {
  /** The name of this membership */
  original?: string;
  /** Membership name translated into buyer's language. Defaults to `original` when not defined. */
  translated?: string | null;
}

export interface MembershipPaymentCredits {
  /** How much credit this membership has in total */
  total?: number;
  /** How much credit remained for this membership */
  remaining?: number;
}

export interface InvalidMembership {
  /** Membership details. */
  membership?: Membership;
  /** Reason why this membership is invalid and cannot be used. */
  reason?: string;
}

export interface AdditionalFee {
  /** Additional fee's unique code (or ID) for future processing */
  code?: string | null;
  /** Translated additional fee's name */
  name?: string;
  /** Additional fee's price */
  price?: MultiCurrencyPrice;
  /** Tax details */
  taxDetails?: TaxDetails;
  /** Provider's app id */
  providerAppId?: string | null;
}

export interface TaxDetails {
  /** Indication if additional fee is taxable or not */
  taxable?: boolean;
}

export interface DeleteCurrentCartRequest {}

export interface DeleteCartResponse {}

export interface CreateCartRequest {
  /** Cart info. */
  cartInfo?: Cart;
  /** The code of an existing coupon to apply to the cart. For more information, see the [Coupons API](https://www.wix.com/velo/reference/wix-marketing-backend/coupons). */
  couponCode?: string | null;
  /** Merchant discounts to apply to specific line items. If no `lineItemIds` are passed, the discount will apply to the whole cart. */
  merchantDiscounts?: MerchantDiscountInput[];
  /** Catalog line items. */
  lineItems?: LineItem[];
  /** Custom line items. */
  customLineItems?: CustomLineItem[];
}

export interface CreateCartResponse {
  /** Cart. */
  cart?: Cart;
}

export interface GetCartRequest {
  /** ID of the cart to retrieve. */
  _id: string;
}

export interface GetCartResponse {
  /** The requested cart. */
  cart?: Cart;
}

export interface GetCartByCheckoutIdRequest {
  /** Checkout ID. */
  _id: string;
}

export interface GetCartByCheckoutIdResponse {
  /** The requested cart. */
  cart?: Cart;
}

export interface GetCurrentCartRequest {}

export interface GetCurrentCartResponse {
  /** Current session's active cart. */
  cart?: Cart;
}

export interface AddToCartRequest {
  /** Cart ID. */
  _id: string;
  /** Catalog line items. */
  lineItems?: LineItem[];
  /** Custom line items. */
  customLineItems?: CustomLineItem[];
}

export interface RemoveLineItemsRequest {
  /** Cart ID. */
  _id: string;
  /** IDs of the line items to remove from the cart. */
  lineItemIds: string[];
}

export interface CreateCheckoutRequest {
  /** Cart ID. */
  _id: string;
  /**
   * Sales channel type. Supported values:
   * + `"AMAZON"`
   * + `"BACKOFFICE_MERCHANT"`
   * + `"EBAY"`
   * + `"OTHER_PLATFORM"`
   * + `"POS"`
   * + `"WEB"`
   * + `"WISH"`
   * + `"WIX_APP_STORE"`
   * + `"WIX_INVOICES"`
   */
  channelType?: ChannelType;
  /** Shipping address. Used for calculating tax and shipping (when applicable). */
  shippingAddress?: Address;
  /** Billing address. Used for calculating tax if all the items in the cart are not shippable. */
  billingAddress?: Address;
  /** Selected shipping option. */
  selectedShippingOption?: SelectedShippingOption;
  /** Mandatory when setting a billing or shipping address if the site visitor isn't logged in. */
  email?: string | null;
}

export interface RemoveCouponRequest {
  /** Cart ID. */
  _id: string;
}

export interface UpdateLineItemsQuantityRequest {
  /** Cart ID. */
  _id: string;
  /** Line item IDs and their new quantity. */
  lineItems: LineItemQuantityUpdate[];
}

export interface EstimateTotalsRequest {
  /** Cart ID. */
  _id: string;
  /** Selected shipping option. */
  selectedShippingOption?: SelectedShippingOption;
  /** Shipping address. Used for calculating tax and shipping (when applicable). */
  shippingAddress?: Address;
  /** Billing address. Used for calculating tax if all the items in the cart are not shippable. */
  billingAddress?: Address;
  /** The selected membership payment options and which line items they apply to. */
  selectedMemberships?: SelectedMemberships;
  /**
   * Whether to calculate tax in the calculation request. If not passed, tax is being calculated.
   * @internal
   */
  calculateTax?: boolean | null;
  /**
   * Whether to calculate shipping in the calculation request. If not passed, shipping is being calculated.
   * @internal
   */
  calculateShipping?: boolean | null;
}

export interface DeleteCartRequest {
  /** ID of the cart to delete. */
  _id: string;
}

export interface DomainEvent extends DomainEventBodyOneOf {
  /** random GUID so clients can tell if event was already handled */
  _id?: string;
  /**
   * Assumes actions are also always typed to an entity_type
   * Example: wix.stores.catalog.product, wix.bookings.session, wix.payments.transaction
   */
  entityFqdn?: string;
  /**
   * This is top level to ease client code dipatching of messages (switch on entity_fqdn+slug)
   * This is although the created/updated/deleted notion is duplication of the oneof types
   * Example: created/updated/deleted/started/completed/email_opened
   */
  slug?: string;
  /**
   * Assuming that all messages including Actions have id
   * Example: The id of the specific order, the id of a specific campaign
   */
  entityId?: string;
  /** The time of the event. Useful if there was a delay in dipatching */
  eventTime?: Date;
  /**
   * A field that should be set if this event was triggered by an anonymize request.
   * For example you must set it to true when sending an event as a result of a GDPR right to be forgotten request.
   * NOTE: This field is not relevant for `EntityCreatedEvent` but is located here for better ergonomics of consumers.
   */
  triggeredByAnonymizeRequest?: boolean | null;
  /** If present, indicates the action that triggered the event. */
  originatedFrom?: string | null;
  createdEvent?: EntityCreatedEvent;
  updatedEvent?: EntityUpdatedEvent;
  deletedEvent?: EntityDeletedEvent;
  actionEvent?: ActionEvent;
  extendedFieldsUpdatedEvent?: ExtendedFieldsUpdatedEvent;
}

/** @oneof */
export interface DomainEventBodyOneOf {
  createdEvent?: EntityCreatedEvent;
  updatedEvent?: EntityUpdatedEvent;
  deletedEvent?: EntityDeletedEvent;
  actionEvent?: ActionEvent;
  extendedFieldsUpdatedEvent?: ExtendedFieldsUpdatedEvent;
}

export interface EntityCreatedEvent {
  entityAsJson?: string;
  /**
   * Indicates the event was triggered by a restore-from-trashbin operation for a previously deleted entity
   * @internal
   */
  triggeredByUndelete?: boolean | null;
}

export interface EntityUpdatedEvent {
  /**
   * Since platformized APIs only expose PATCH and not PUT we can't assume that the fields sent from the client are the actual diff.
   * This means that to generate a list of changed fields (as opposed to sent fields) one needs to traverse both objects.
   * We don't want to impose this on all developers and so we leave this traversal to the notification recipients which need it.
   */
  currentEntityAsJson?: string;
  /**
   * This field is currently part of the of the EntityUpdatedEvent msg, but scala/node libraries which implements the domain events standard
   * wont populate it / have any reference to it in the API.
   * The main reason for it is that fetching the old entity from the DB will have a performance hit on an update operation so unless truly needed,
   * the developer should send only the new (current) entity.
   * An additional reason is not wanting to send this additional entity over the wire (kafka) since in some cases it can be really big
   * Developers that must reflect the old entity will have to implement their own domain event sender mechanism which will follow the DomainEvent proto message.
   * @internal
   */
  previousEntityAsJson?: string | null;
}

export interface EntityDeletedEvent {
  /**
   * Indicates if the entity is sent to trash-bin. only available when trash-bin is enabled
   * @internal
   */
  movedToTrash?: boolean | null;
}

export interface ActionEvent {
  bodyAsJson?: string;
}

export interface ExtendedFieldsUpdatedEvent {
  currentEntityAsJson?: string;
}

export interface Empty {}

/** This webhook is triggered when a customer has completed their checkout. In most cases, an order will be created immediately and an Order Event webhook will also be triggered. In some cases, the payment provider may list the order as "pending" - and the order will not be created until the payment is listed as "approved." */
export interface CartCompletedEvent {
  cartId?: string;
  /**
   * Time the cart was created
   * @readonly
   */
  completedTime?: Date;
  /** Customer's Wix ID */
  buyerInfo?: V1BuyerInfo;
  /**
   * Weight measurement unit - defaults to site's weight unit. Supported values:
   * + `"KG"`
   * + `"LB"`
   */
  weightUnit?: V1WeightUnit;
  /** Message from the customer */
  buyerNote?: string | null;
  /** Customer's billing address */
  billingAddress?: CartAddress;
  /** Currency used for pricing in this store */
  currency?: Currency;
  /** Coupon applied to this cart */
  appliedCoupon?: AppliedCoupon;
  /** Totals for order's line items */
  totals?: Totals;
  /** Cart shipping information */
  shippingInfo?: ShippingInfo;
}

/** This might expand and add additional data */
export interface V1BuyerInfo {
  /** Customer details */
  _id?: string;
  /** Customer's relationship to the website */
  identityType?: IdentityType;
  /** Customer's email address */
  email?: string | null;
  /** Customer's phone number */
  phone?: string | null;
  /** Customer's first name */
  firstName?: string | null;
  /** Customer's last name */
  lastName?: string | null;
}

export enum IdentityType {
  /** Customer is the site owner */
  ADMIN = 'ADMIN',
  /** Customer is logged in */
  MEMBER = 'MEMBER',
  /** Customer is not logged in */
  VISITOR = 'VISITOR',
  /** Contact was created for the customer */
  CONTACT = 'CONTACT',
}

export enum V1WeightUnit {
  /** Weight unit can't be classified, due to an error */
  UNSPECIFIED_WEIGHT_UNIT = 'UNSPECIFIED_WEIGHT_UNIT',
  /** Kilograms */
  KG = 'KG',
  /** Pounds */
  LB = 'LB',
}

export interface CartAddress {
  /** Address */
  address?: CommonAddress;
  /** Contact details */
  contactDetails?: FullAddressContactDetails;
}

/** Physical address */
export interface CommonAddress extends CommonAddressStreetOneOf {
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
export interface CommonAddressStreetOneOf {
  /** Street name and number. */
  streetAddress?: StreetAddress;
  /** Main address line, usually street and number as free text. */
  addressLine?: string | null;
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

/** Full contact details for an address */
export interface FullAddressContactDetails {
  /** Contact first name */
  firstName?: string | null;
  /** Contact last name */
  lastName?: string | null;
  /**
   * Contact full name
   * @internal
   */
  fullName?: string | null;
  /** Contact phone number */
  phone?: string | null;
  /** Contact's company */
  company?: string | null;
  /** Email associated with the address */
  email?: string | null;
  /** tax info (Currently usable only in Brazil) */
  vatId?: VatId;
}

export interface Currency {
  /** Currency code */
  code?: string;
  /** Currency symbol */
  symbol?: string;
}

export interface AppliedCoupon {
  /** Coupon internal ID */
  couponId?: string;
  /** Coupon name */
  name?: string;
  /** Coupon code */
  code?: string;
  /** Discount value */
  discountValue?: string | null;
  /** Converted discount value */
  convertedDiscountValue?: string | null;
  /** Type (e.g., moneyOff, percentOff) */
  couponType?: string;
}

export interface Totals {
  /** Subtotal of all line items, before tax */
  subtotal?: number;
  /** Total shipping price, including tax */
  shipping?: number;
  /** Total tax */
  tax?: number;
  /** Total calculated discount value, according to order.discount */
  discount?: number | null;
  /** Total price */
  total?: number;
  /** Total items weight */
  weight?: number;
  /** Total line items quantity */
  quantity?: number;
}

export interface ShippingInfo extends ShippingInfoDetailsOneOf {
  /** Selected shipping rule details */
  shippingRuleDetails?: ShippingRuleDetails;
  /** Pickup details when this object describes pickup */
  pickupDetails?: V1PickupDetails;
  /** Shipment details when this object describes shipment */
  shippingAddress?: CartAddress;
}

/** @oneof */
export interface ShippingInfoDetailsOneOf {
  /** Pickup details when this object describes pickup */
  pickupDetails?: V1PickupDetails;
  /** Shipment details when this object describes shipment */
  shippingAddress?: CartAddress;
}

export interface ShippingRuleDetails {
  /** Selected shipping rule ID */
  ruleId?: string;
  /** Selected option ID */
  optionId?: string;
  /** Rule title (as provided by the store owner) */
  deliveryOption?: string;
  /** Shipping option delivery time */
  estimatedDeliveryTime?: string | null;
}

export interface V1PickupDetails {
  /** Pickup address */
  pickupAddress?: CommonAddress;
  /** Customer details */
  buyerDetails?: BuyerDetails;
  /** Store owner's pickup instructions */
  pickupInstructions?: string | null;
}

export interface BuyerDetails {
  /** Customer's first name */
  firstName?: string | null;
  /** Customer's last name */
  lastName?: string | null;
  /** Email address */
  email?: string;
  /** Phone number */
  phone?: string;
}

const _addressWithContact = { address: 'wix.common.Address' };
const _addToCartRequest = {
  lineItems: '_lineItem',
  customLineItems: '_customLineItem',
};
const _addToCartResponse = { cart: '_cart' };
const _carrierServiceOption = { shippingOptions: '_shippingOption' };
const _cart = { lineItems: '_lineItem', contactInfo: '_addressWithContact' };
const _createCartRequest = {
  cartInfo: '_cart',
  lineItems: '_lineItem',
  customLineItems: '_customLineItem',
};
const _createCartResponse = { cart: '_cart' };
const _createCheckoutRequest = {
  shippingAddress: 'wix.common.Address',
  billingAddress: 'wix.common.Address',
};
const _createCheckoutResponse = {};
const _customLineItem = { media: 'wix.common.Image' };
const _deleteCartRequest = {};
const _deleteCartResponse = {};
const _deliveryLogistics = { pickupDetails: '_pickupDetails' };
const _estimateTotalsRequest = {
  shippingAddress: 'wix.common.Address',
  billingAddress: 'wix.common.Address',
};
const _estimateTotalsResponse = {
  cart: '_cart',
  shippingInfo: '_shippingInformation',
};
const _getCartByCheckoutIdRequest = {};
const _getCartByCheckoutIdResponse = { cart: '_cart' };
const _getCartRequest = {};
const _getCartResponse = { cart: '_cart' };
const _getCurrentCartRequest = {};
const _getCurrentCartResponse = { cart: '_cart' };
const _lineItem = { url: 'wix.common.PageUrlV2', image: 'wix.common.Image' };
const _pickupDetails = { address: 'wix.common.Address' };
const _removeCouponRequest = {};
const _removeCouponResponse = { cart: '_cart' };
const _removeLineItemsRequest = {};
const _removeLineItemsResponse = { cart: '_cart' };
const _selectedCarrierServiceOption = { logistics: '_deliveryLogistics' };
const _shippingInformation = {
  selectedCarrierServiceOption: '_selectedCarrierServiceOption',
  carrierServiceOptions: '_carrierServiceOption',
};
const _shippingOption = { logistics: '_deliveryLogistics' };
const _updateCartRequest = {
  cartInfo: '_cart',
  lineItems: '_lineItem',
  customLineItems: '_customLineItem',
};
const _updateCartResponse = { cart: '_cart' };
const _updateLineItemsQuantityRequest = {};
const _updateLineItemsQuantityResponse = { cart: '_cart' };

/**
 * Creates a new cart.
 *
 * > **Note:** When adding catalog items, `options.lineItems.catalogReference` is required.
 *
 *
 * The `createCart()` function returns a Promise that resolves to the new cart when it's created.
 * @public
 * @requiredField options.lineItems.catalogReference
 * @returns Fulfilled - Cart.
 */
export function createCart(
  options?: CreateCartOptions
) {
  const requestTransformation = {
    cartInfo: '$[0].cartInfo',
    couponCode: '$[0].couponCode',
    merchantDiscounts: '$[0].merchantDiscounts',
    lineItems: '$[0].lineItems',
    customLineItems: '$[0].customLineItems',
  };
  const responseTransformation = '$';

  const { toAmbassadorRequest } = serializer({
    rootSchema: _createCartRequest,
    depSchemas: { _addressWithContact, _cart, _customLineItem, _lineItem },
    fqdnTransformation: {
      paths: [...['cartInfo']],
      transformation: _fromVeloEntity,
    },
    customTransformation: requestTransformation,
  });

  const { fromJSON } = serializer({
    rootSchema: _createCartResponse,
    depSchemas: { _addressWithContact, _cart, _lineItem },
    fqdnTransformation: {
      paths: [...['cart']],
      transformation: _toVeloEntity,
    },
    customTransformation: responseTransformation,
  });

  const payload = toAmbassadorRequest([options]);

  const reqOpts = ambassadorWixEcomV1Cart.createCart(payload);

  __log(`"CreateCart" sending request with: ${__inspect(reqOpts)}`);

  return {reqOpts, fromJSON}
}

export interface CreateCartOptions {
  /** Cart info. */
  cartInfo?: Cart;
  /** The code of an existing coupon to apply to the cart. For more information, see the [Coupons API](https://www.wix.com/velo/reference/wix-marketing-backend/coupons). */
  couponCode?: string | null;
  /** Merchant discounts to apply to specific line items. If no `lineItemIds` are passed, the discount will apply to the whole cart. */
  merchantDiscounts?: MerchantDiscountInput[];
  /** Catalog line items. */
  lineItems?: LineItem[];
  /** Custom line items. */
  customLineItems?: CustomLineItem[];
}

export function getCurrentCart(): {reqOpts: RequestOptionsFactory<GetCurrentCartResponse>, fromJSON: () => GetCurrentCartResponse} {
  const requestTransformation = {};
  const responseTransformation = '$';

  const { toAmbassadorRequest } = serializer({
    rootSchema: _getCurrentCartRequest,
    depSchemas: {},
    fqdnTransformation: {
      paths: [],
      transformation: _fromVeloEntity,
    },
    customTransformation: requestTransformation,
  });

  const { fromJSON } = serializer({
    rootSchema: _getCurrentCartResponse,
    depSchemas: { _addressWithContact, _cart, _lineItem },
    fqdnTransformation: {
      paths: [...['cart']],
      transformation: _toVeloEntity,
    },
    customTransformation: responseTransformation,
  });

  const payload = toAmbassadorRequest([]);

  const reqOpts = ambassadorWixEcomV1Cart.getCurrentCart(payload);

  __log(`"GetCurrentCart" sending request with: ${__inspect(reqOpts)}`);

  // @ts-ignore
  return {reqOpts, fromJSON}
}

export const cart = {getCurrentCart, createCart}
