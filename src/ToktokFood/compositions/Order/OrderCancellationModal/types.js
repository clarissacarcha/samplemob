/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  isVisible: boolean,
  onCancel: () => void,
  onConfirm: string => string,
};
