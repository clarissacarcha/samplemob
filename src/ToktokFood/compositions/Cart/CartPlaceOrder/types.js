/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  amountText?: number,
  cartData?: Object,
  paymentMethod?: string,
  scroll?: Function,
  cartPaymentMethodCoordinates?: number,
  startAnimation?: Function,
  endAnimation?: Function,
  deliveryReceiver?: string,
  receiverContact?: string,
  receiverLandmark?: string,
  cartDriverNote?: string,
  cartServiceType?: string,
  cartDeliveryInfo?: Object,
  userWallet?: Object,
  setIsInsufficientBalance?: Function,
  cartRefetch?: any,
};
