/**
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import type {PropsType} from './types';
import {Container, AmountContainer, AmountText, AmountBreakdownContainer, Loader} from './Styled';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useTheme} from 'styled-components';

const OrderAmount = (props: PropsType): React$Node => {
  const {state} = props;
  const [showAmountBreakdown, setShowAmountBreakdown] = useState(false);
  const theme = useTheme();

  const amountComponent = (title, amount, sign = '', icon) => {
    return (
      <AmountContainer>
        <AmountText total={title === 'Total'}>{title}</AmountText>
        {state && Object.keys(state).length > 0 ? (
          <AmountContainer>
            <AmountText total={title === 'Total'} sign={sign}>
              {sign} &#x20B1;{parseFloat(amount).toFixed(2)}
            </AmountText>
            {icon && <FeatherIcon name={icon} color={theme.color.orange} size={18} />}
          </AmountContainer>
        ) : (
          <Loader active title={false} pRows={1} pWidth={100} pHeight={18} />
        )}
      </AmountContainer>
    );
  };

  const renderAmountBreakdownComponent = () => {
    if (showAmountBreakdown) {
      return (
        <AmountBreakdownContainer>
          {amountComponent('Subtotal', state?.srpTotal)}
          {state?.resellerDiscountTotal > 0 &&
            amountComponent('Discount (Reseller)', state?.resellerDiscountTotal, '-')}
          {state?.promoDiscounts > 0 && amountComponent('Discount (Voucher)', state?.promoDiscounts, '-')}
          {state?.promoDetails?.amount > 0 && amountComponent('Discount (Delivery)', state?.promoDetails?.amount, '-')}
          {state?.orderIsfor === 1 && amountComponent('Delivery Fee', state?.originalShippingFee)}
          {state?.refundTotal > 0 &&
            state?.paymentMethod?.toLowerCase() === 'toktokwallet' &&
            amountComponent('Refund Amount', state?.refundTotal, '+')}
        </AmountBreakdownContainer>
      );
    }
    return null;
  };

  return (
    <Container>
      {renderAmountBreakdownComponent()}
      <TouchableOpacity activeOpacity={0.9} onPress={() => setShowAmountBreakdown(!showAmountBreakdown)}>
        {amountComponent(
          'Total',
          state?.totalAmount + state?.originalShippingFee,
          '',
          showAmountBreakdown ? 'chevron-down' : 'chevron-up',
        )}
      </TouchableOpacity>
    </Container>
  );
};

export default OrderAmount;
