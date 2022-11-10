/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  paymentMethod?: string,
  cartItems?: Array<Object>,
  totalAmount?: number,
  deliveryFee?: number,
  errorVoucherMessage?: string,
  setErrorVoucherMessage?: Function,
  setIsInsufficientBalance?:Function
};
