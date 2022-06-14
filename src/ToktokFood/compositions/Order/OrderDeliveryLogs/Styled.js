/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';
import DashedLine from 'react-native-dashed-line';
import FIcon5 from 'react-native-vector-icons/FontAwesome';

export const Container: ComponentType<any> = styled.View`
  padding: 20px;
  padding-bottom: 50px;
`;

export const LogsContainer: ComponentType<any> = styled.View`
  margin-top: 20px;
`;

export const DashContainer: ComponentType<any> = styled.View`
  height: ${props => props.height};
  flex-direction: row;
  padding-left: 3px;
`;

export const LogContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TextContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const DeliveryImageContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ImageContainer: ComponentType<any> = styled.View`
  flex: 1;
  height: 280px;
  margin-left: 17px;
`;

export const Image: ComponentType<any> = styled.Image`
  height: 100%;
  width: 100%;
  resize-mode: cover;
  border-radius: 5px;
`;

export const Title: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  mode: 'semibold',
}))`
  margin-bottom: 20px;
`;

export const DeclinedText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  color: props.theme.color.darkgray,
}))`
  align-self: center;
  text-align: center;
  margin-top: 25px;
`;

export const Text: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  mode: props.isValid ? 'semibold' : 'regular',
  color: props.isValid ? props.theme.color.orange : props.theme.color.gray,
}))`
  margin-left: 17px;
`;

export const Icon: ComponentType<any> = styled(FIcon5).attrs(props => ({
  ...props,
  size: 10,
  name: 'circle',
  color: props.isValid ? props.theme.color.orange : props.theme.color.lightgray,
}))`
  padding: 0;
  margin: 0;
`;

export const Dash: ComponentType<any> = styled(DashedLine).attrs(props => ({
  ...props,
  axis: 'vertical',
  dashGap: 2,
  dashColor: props.theme.color.lightgray,
  dashLength: 2,
  dashThickness: 2,
}))`
  border-radius: 5px;
`;
