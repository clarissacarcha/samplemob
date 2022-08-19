/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  label: string,
  hasBack?: boolean,
  pinCode: string,
  showPin: boolean,
  errorMessage: string,
  setPinCode: any,
  onPressForgotPin: () => void,
  numberOfBox?: number,
};
