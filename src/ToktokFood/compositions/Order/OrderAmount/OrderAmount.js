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

  const amountComponent = (title, amount, icon) => {
    return (
      <AmountContainer>
        <AmountText total={title === 'Total'}>{title}</AmountText>
        {state && Object.keys(state).length > 0 ? (
          <AmountContainer>
            <AmountText total={title === 'Total'}>&#x20B1;{parseFloat(amount).toFixed(2)}</AmountText>
            {icon && <FeatherIcon name={icon} color={theme.color.orange} size={18} />}
          </AmountContainer>
        ) : (
          <Loader active title={false} pRows={1} pWidth={100} pHeight={18} />
        )}
      </AmountContainer>
    );
  };

  return (
    <Container>
      {showAmountBreakdown && (
        <AmountBreakdownContainer>
          {amountComponent('Subtotal', state?.srpTotalamount)}
          {state?.orderIsfor === 1 && amountComponent('Delivery Fee', state?.originalShippingFee)}
        </AmountBreakdownContainer>
      )}
      <TouchableOpacity activeOpacity={0.9} onPress={() => setShowAmountBreakdown(!showAmountBreakdown)}>
        {amountComponent(
          'Total',
          state?.totalAmount + state?.originalShippingFee,
          showAmountBreakdown ? 'chevron-down' : 'chevron-up',
        )}
      </TouchableOpacity>
    </Container>
  );
};

export default OrderAmount;
