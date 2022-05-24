/**
 * @flow
 */

import type {ComponentType} from 'react';

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  containerStyle?: Object,
  centerContainerStyle?: Object,
  leftContainerStyle?: Object,
  title?: string,
  titleStyle?: Object,
  CenterComponent?: ComponentType<any>,
  LeftComponent?: ComponentType<any>,
  RightComponent?: ComponentType<any>,
  hasBack?: boolean,
  barStyle?: 'light-content' | 'dark-content',
  backButtonFn?: (() => any) | null,
  backButtonColor?: string,
  backgroundColor?: string,
  icon?: string,
};
