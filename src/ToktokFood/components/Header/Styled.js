/**
 * @flow
 */

/** @jsx jsx */
import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {Header, Icon} from 'react-native-elements';

// import StyledText from 'toktokfood/components/StyledText';

export const NHeader: ComponentType<any> = styled(Header).attrs(props => ({
  ...props,
  backgroundColor: props.theme.color.white,
}))``;

export const BackButton: ComponentType<any> = styled(Icon).attrs(props => ({
  name: props.icon || 'chevron-back-outline',
  type: 'ionicon',
  color: props.color || props.theme.color.orange,
  size: 30,
  //   ...props,
}))``;

// export const NotifIcon: ComponentType<any> = styled(Icon).attrs(props => ({
//   ...props,
//   color: props.theme.color.BORDERGRAY,
//   name: 'bell',
//   type: 'font-awesome',
//   size: 20,
//   marginRight: 10,
// }))``;
