/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  color?: string,
  textColor?: string,
  value?: string,
  onValueChange: string => any | null,
  style?: Object,
  onPress?: () => void,
};
