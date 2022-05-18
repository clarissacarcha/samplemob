/**
 * @flow
 */

import type {ComponentType} from 'react';

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  containerStyle?: Object,
  title?: string,
  titleStyle?: Object,
  CenterComponent?: ComponentType<any>,
  LeftComponent?: ComponentType<any>,
  RightComponent?: ComponentType<any>,
  hasBack?: boolean,
  backButtonFn?: (() => any) | null,
  barStyle?: 'light-content' | 'dark-content',
  backButtonColor?: string,
  icon?: string,
};
