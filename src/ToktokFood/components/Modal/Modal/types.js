/**
 * @flow
 */
import type {ComponentType} from 'react';
export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  isVisible: boolean,
  children: ComponentType<any>,
  animationIn?: string,
  animationOut?: string,
  coverScreen?: boolean,
  hasBackdrop?: boolean,
  backdropColor?: string,
  backdropOpacity?: number,
  onBackButtonPress?: () => void,
  onBackdropPress?: () => void,
  hideModalContentWhileAnimating?: boolean,
  style?: Object,
  deviceWidth?: number,
  deviceHeight?: number,
  customBackdrop?: ComponentType<any>,
  transparent?: boolean,
  flex?: number,
  propagateSwipe?: boolean,
  borderRadius?: number,
};
