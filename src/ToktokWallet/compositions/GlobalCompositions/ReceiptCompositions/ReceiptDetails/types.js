/**
 * @flow
 */

import type {ComponentType} from 'react';

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  receipt: Object,
  children: ComponentType<any>,
};
