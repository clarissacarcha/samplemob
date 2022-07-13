/**
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import type {PropsType} from './types';
import {Container, AmountContainer, AmountText, AmountBreakdownContainer, Loader, DiscountIcon} from './Styled';
import {useTheme} from 'styled-components';

const OrderAmount = (props: PropsType): React$Node => {
  const {state} = props;
  const {resellerDiscountTotal = 0, promoDiscounts = 0, voucherDiscounts = [], originalShippingFee = 0} = state;
  const shippingDiscount = state.promoDetails?.amount || 0;
  const [showAmountBreakdown, setShowAmountBreakdown] = useState(false);
  const [showDiscountBreakdown, setShowDiscountBreakdown] = useState(false);
  const theme = useTheme();

  const amountComponent = (type = '', title, amount, sign = '', icon, onPress) => {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} disabled={icon ? false : true}>
        <AmountContainer>
          <AmountContainer>
            <AmountText type={type} total={title === 'Total'}>
              {title}
            </AmountText>
            {icon && title === 'Discount' && <DiscountIcon name={icon} color={theme.color.black} size={18} />}
          </AmountContainer>
          {state && Object.keys(state).length > 0 ? (
            <AmountContainer>
              <AmountText total={title === 'Total'} sign={sign}>
                {sign} &#x20B1;{parseFloat(amount).toFixed(2)}
              </AmountText>
              {icon && title === 'Total' && <DiscountIcon name={icon} color={theme.color.orange} size={18} />}
            </AmountContainer>
          ) : (
            <Loader active title={false} pRows={1} pWidth={100} pHeight={18} />
          )}
        </AmountContainer>
      </TouchableOpacity>
    );
  };

  const renderDiscountComponent = () => {
    if (resellerDiscountTotal || promoDiscounts || shippingDiscount) {
      const totalDiscount = resellerDiscountTotal + promoDiscounts + shippingDiscount;
      return (
        <React.Fragment>
          {amountComponent(
            '',
            'Discount',
            totalDiscount,
            '-',
            showDiscountBreakdown ? 'chevron-down' : 'chevron-up',
            () => setShowDiscountBreakdown(!showDiscountBreakdown),
          )}
          {showDiscountBreakdown && (
            <React.Fragment>
              {resellerDiscountTotal > 0 && amountComponent('Discount', 'Reseller', resellerDiscountTotal, '-')}
              {promoDiscounts > 0 &&
                voucherDiscounts.map(voucher =>
                  amountComponent('Discount', voucher?.voucherName, voucher?.discountAmount, '-'),
                )}
              {shippingDiscount > 0 &&
                amountComponent('Discount', state?.promoDetails?.shippingDiscountName, shippingDiscount, '-')}
            </React.Fragment>
          )}
        </React.Fragment>
      );
    }
  };

  const renderTotalAmountComponent = () => {
    let icon;
    if (resellerDiscountTotal || promoDiscounts || shippingDiscount || originalShippingFee) {
      icon = showAmountBreakdown ? 'chevron-down' : 'chevron-up';
    }
    return amountComponent(
      '',
      'Total',
      state?.totalAmount + state?.originalShippingFee - shippingDiscount,
      '',
      icon,
      () => setShowAmountBreakdown(!showAmountBreakdown),
    );
  };

  const renderAmountBreakdownComponent = () => {
    if (showAmountBreakdown) {
      return (
        <AmountBreakdownContainer>
          {amountComponent('', 'Subtotal', state?.srpTotal)}
          {state?.orderIsfor === 1 && amountComponent('', 'Delivery Fee', state?.originalShippingFee)}
          {renderDiscountComponent()}
        </AmountBreakdownContainer>
      );
    }
    return null;
  };

  return (
    <Container>
      {renderAmountBreakdownComponent()}
      {renderTotalAmountComponent()}
    </Container>
  );
};

export default OrderAmount;
