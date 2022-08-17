/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  selectedValue: string,
  onSelectedValue: string => void,
  errorMessage: string,
};
