/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  isVisible: boolean,
  text?: string,
  type?: 'success' | 'error' | typeof undefined | null,
};
