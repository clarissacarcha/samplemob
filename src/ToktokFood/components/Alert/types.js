/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  isVisible: boolean,
  type?: 'success' | 'warning' | 'error' | 'info',
  title?: string,
  subtitle?: string,
  buttonText?: string,
  onPress: () => void,
};
