/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  subTotal?: number,
  paymentMethod?: string,
  cartItems?: Array<Object>,
  shippingType?: string,
  totalAmount?: number,
  srpTotalAmount?: number,
  pabiliShopDetails?: Object,
  pabiliShopServiceFee?: number,
  pabiliShopResellerDiscount?: number,
  setCartTotalAmount: Function,
  setCartDeliveryInfo: Function,
};
