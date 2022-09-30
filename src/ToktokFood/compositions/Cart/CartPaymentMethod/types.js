/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  cartPaymentMethod: string,
  setCartPaymentMethod: Function,
  setCartPaymentMethodCoordinates: Function,
  animation?: Object,
  setUserWallet?: Function,
  isInsufficientBalance?: boolean,
  amountText?: number,
  setErrorVoucherMessage?: Function,
};
