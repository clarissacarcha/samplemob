/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  type?: 'primary' | 'secondary',
  height?: number,
  buttonText: string,
  onPress: () => void,
  style?: Object,
  disabled?: boolean,
};
