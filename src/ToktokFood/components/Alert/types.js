/**
 * @flow
 */
import type {ComponentType} from 'react';
export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  isVisible: boolean,
  type?: 'success' | 'warning' | 'error' | 'info' | 'question',
  title?: string,
  subtitle?: string,
  buttonText?: string,
  onPress: () => void,
  buttonText2?: string,
  onPress2?: () => void,
  BodyComponent?: ComponentType<any>,
};
