/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  state: Object,
  placement?: 'StatusScreen' | 'OrderDetailsScreen',
};

export type StateTypes = {
  originalShippingFee: number,
  promoDiscounts: number,
  resellerDiscountTotal: number,
  voucherDiscounts: Array<any>,
  pabiliShopResellerDiscount: number,
};
