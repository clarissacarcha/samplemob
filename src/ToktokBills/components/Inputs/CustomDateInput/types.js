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
  label?: string,
  dateFormat?: string,
  placeholder?: string,
  minDate?: Date,
  isMinDateToday?: boolean,
  displaySelectedValue: string,
  hasIcon?: boolean,
};
