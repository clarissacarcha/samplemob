/**
 * @flow
 */

import type {ComponentType} from 'react';
import {Image} from 'react-native';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';

export const Container: ComponentType<any> = styled.View`
  padding: 20px;
`;

export const Row: ComponentType<any> = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const DeliveryDistanceContainer: ComponentType<any> = styled.View`
  margin-top: 15px;
  margin-bottom: 5px;
  flex-direction: row;
`;

export const IconTextContainer: ComponentType<any> = styled.View`
  align-items: center;
  flex-direction: row;
  margin-right: 25px;
`;

export const Icon: ComponentType<any> = styled(Image).attrs(props => ({
  ...props,
  resizeMode: 'cover',
}))`
  width: 17px;
  height: 17px;
  margin-right: 10px;
`;

export const Title: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  mode: 'semibold',
}))`
  margin-bottom: 5px;
`;
