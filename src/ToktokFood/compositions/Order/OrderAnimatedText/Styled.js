/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';
import {moderateScale} from 'toktokfood/helper/scale';
import ContentLoader from 'react-native-easy-content-loader';

export const Loader: ComponentType<any> = styled(ContentLoader).attrs(props => ({
  ...props,
  titleStyles: {
    alignSelf: 'center',
    height: 18,
  },
  paragraphStyles: {
    alignSelf: 'center',
  },
}))``;

export const AnimationText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  mode: props.title ? 'bold' : 'regular',
  fontSize: props.title ? 18 : 13,
  color: props.title ? props.theme.color.orange : props.theme.color.black,
}))`
  margin-bottom: ${props => (props.title ? moderateScale(10) : 0)};
  text-align: center;
`;
