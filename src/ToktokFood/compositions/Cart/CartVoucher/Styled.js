/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import StyledInputText from 'toktokfood/components/StyledInputText';

export const Container: ComponentType<any> = styled.View`
  padding: 20px;
`;

export const Column: ComponentType<any> = styled.View`
  flex: 1;
`;

export const VoucherContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-vertical: 5px;
  padding-horizontal: 7px;
  margin-right: 7px;
  margin-bottom: 5px;
  background-color: ${props =>
    props.type === 'deal' || props.type === 'auto' ? props.theme.color.yellow : props.theme.color.orange};
`;

export const VouchersContainer: ComponentType<any> = styled.View`
  padding-bottom: 15px;
  padding-top: 5px;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

export const Row: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: ${props => (props.apply ? 'flex-start' : 'center')};
`;

export const Image: ComponentType<any> = styled.Image`
  width: 25px;
  height: 25px;
  resize-mode: cover;
  margin-right: 10px;
`;

export const ApplyButton: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  color: props.theme.color.orange,
}))`
  margin-left: 20px;
  margin-top: 10px;
`;

export const VoucherText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  color: props.theme.color.white,
  fontSize: 11,
  mode: 'semibold',
}))``;

export const VoucherErrorText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  color: props.theme.color.red,
  fontSize: 11,
}))`
  margin-top: 1px;
`;

export const Icon: ComponentType<any> = styled(AntDesign).attrs(props => ({
  ...props,
  color: props.theme.color.white,
}))`
  margin-left: 7px;
`;

export const Input: ComponentType<any> = styled(StyledInputText).attrs(props => ({
  ...props,
  placeholder: 'Enter voucher code (optional)',
}))`
  border-color: ${props => (props.error?.length > 0 ? props.theme.color.red : props.theme.textInput.container)};
`;
