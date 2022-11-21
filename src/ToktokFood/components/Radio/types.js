/**
 * @flow
 */
import type {ComponentType} from 'react';
export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  onPress: () => void,
  title: string,
  checked: boolean,
  disabled?: boolean,
  RightComponent?: ComponentType<any>,
};
