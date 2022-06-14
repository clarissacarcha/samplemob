/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';
import StyledButton from 'toktokfood/components/StyledButton';
import Header from 'toktokfood/components/Header';
import {moderateScale} from 'toktokfood/helper/scale';
import {Modal} from 'toktokfood/components/Modal';
import {Platform, ScrollView} from 'react-native';
import FIcon from 'react-native-vector-icons/Feather';

export const Container: ComponentType<any> = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

export const AnimationContainer: ComponentType<any> = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const AnimationText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  mode: props.title ? 'bold' : 'regular',
  fontSize: props.title ? 18 : 13,
  color: props.title ? props.theme.color.orange : props.theme.color.black,
}))`
  margin-bottom: ${props => (props.title ? moderateScale(10) : 0)};
`;

export const CancelledText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
}))`
  text-align: center;
  margin-bottom: 20px;
`;

export const ReasonText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  fontSize: props.label ? 11 : 13,
  color: props.label ? props.theme.color.darkgray : props.theme.color.black,
}))`
  margin-vertical: ${props => (props.label ? 20 : 0)};
  margin-bottom: ${props => (props.label ? 10 : 20)};
  align-self: flex-start;
`;

export const ModifiedText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  fontSize: 11,
  color: props.theme.color.orange,
}))`
  width: 95%;
`;

export const BottomContainer: ComponentType<any> = styled.View`
  background-color: #ffffff;
  border-width: 3px;
  border-left-width: 1px;
  border-right-width: 1px;
  border-bottom-width: 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin-left: -1px;
  margin-right: -1px;
  border-left-color: #ffffff;
  border-right-color: #ffffff;
  border-top-color: ${props => props.theme.color.orange};
`;

export const ButtonContainer: ComponentType<any> = styled.View`
  padding: 20px;
`;

export const AmountContainer: ComponentType<any> = styled.View`
  padding-top: 20px;
`;

export const ModifiedContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.color.lightYellow};
  padding-horizontal: 20px;
  padding-vertical: 15px;
  margin-top: ${props => (props.adjustSpacing ? -20 : 0)};
  margin-bottom: ${props => (props.adjustSpacing ? 20 : 0)};
`;

export const Button: ComponentType<any> = styled(StyledButton).attrs(props => ({
  ...props,
}))`
  margin-bottom: ${props => (props.orderStatus && props.orderStatus === 'p' ? 15 : 0)};
`;

export const Icon: ComponentType<any> = styled(FIcon).attrs(props => ({
  ...props,
}))`
  margin-right: 10px;
`;

export const CustomModal: ComponentType<any> = styled(Modal).attrs(props => ({
  ...props,
  backdropOpacity: 1,
  propagateSwipe: true,
}))`
  margin: 0px;
`;

export const CancelModal: ComponentType<any> = styled(Modal).attrs(props => ({
  ...props,
}))``;

export const HeaderContainer: ComponentType<any> = styled.View`
  border-bottom-width: 1;
  border-bottom-color: rgba(0, 0, 0, 0.05);
`;

export const OrderDetailsHeader: ComponentType<any> = styled(Header).attrs(props => ({
  ...props,
  title: 'Order Details',
  titleStyle: {
    fontSize: 17,
  },
  centerContainerStyle: {
    top: Platform.OS === 'ios' ? 5 : 8,
  },
}))``;

export const Scroll: ComponentType<any> = styled(ScrollView).attrs(props => ({
  ...props,
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  showsVerticalScrollIndicator: false,
}))``;
