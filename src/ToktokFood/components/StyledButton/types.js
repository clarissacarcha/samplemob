/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  type?: 'primary' | 'secondary',
  height?: number,
  children: string,
  onPress: () => void,
  style?: Object,
};
