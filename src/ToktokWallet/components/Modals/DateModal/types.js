/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  visible: boolean,
  setVisible: any,
  value: string,
  onDateChange: string => void,
  isCurrentDate?: boolean,
  minDate?: Date,
  maxDate?: Date,
};
