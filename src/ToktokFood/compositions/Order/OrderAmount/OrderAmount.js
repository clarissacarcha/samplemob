/**
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import type {PropsType, StateTypes} from './types';
import {Container, AmountContainer, AmountText, AmountBreakdownContainer, Loader, DiscountIcon} from './Styled';
import {useTheme} from 'styled-components';
import Alert from 'toktokfood/components/Alert';

const OrderAmount = (props: PropsType): React$Node => {
  const {state, placement} = props;
  const {
    resellerDiscountTotal = 0,
    promoDiscounts = 0,
    voucherDiscounts = [],
    originalShippingFee = 0,
    pabiliShopResellerDiscount = 0,
  }: StateTypes = state;
  const shippingDiscount =
    state?.promoDetails && state.promoDetails?.amount === 0
      ? state.originalShippingFee
      : state.promoDetails?.amount || 0;
  const [showAmountBreakdown, setShowAmountBreakdown] = useState(false);
  const [showDiscountBreakdown, setShowDiscountBreakdown] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const theme = useTheme();

  const renderAlertComponent = () => (
    <Alert
      isVisible={isAlertVisible}
      // type={type}
      // title={title}
      subtitle="This fee is for us to continue providing
      excellent delivery experience along with
      better promos and to expand our
      merchants selection."
      buttonText="OK"
      onPress={() => setIsAlertVisible(false)}
    />
  );

  const amountComponent = (type = '', title, amount, sign = '', icon, onPress): React$Node => {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} disabled={icon ? false : true}>
        <AmountContainer>
          <AmountContainer>
            <AmountText type={type} total={title === 'Total'} placement={placement}>
              {title}
            </AmountText>
            {icon && title === 'Discount' && <DiscountIcon name={icon} color={theme.color.black} size={18} />}
            {icon && title === 'Service Fee' && <DiscountIcon name={icon} color={theme.color.orange} size={15} />}
          </AmountContainer>
          {state && Object.keys(state).length > 0 ? (
            <AmountContainer>
              {typeof amount === 'number' ? (
                <AmountText total={title === 'Total'} sign={sign} placement={placement}>
                  {sign} &#x20B1;{parseFloat(amount).toFixed(2)}
                </AmountText>
              ) : (
                <AmountText total={title === 'Total'} sign={sign} placement={placement}>
                  {amount}
                </AmountText>
              )}
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
    if (resellerDiscountTotal || promoDiscounts || shippingDiscount || pabiliShopResellerDiscount) {
      const serviceFeeDiscount = state?.totalServiceFee - pabiliShopResellerDiscount;
      const totalDiscount =
        promoDiscounts +
        shippingDiscount +
        (state?.serviceType === 'toktokfood' ? resellerDiscountTotal : serviceFeeDiscount);
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
              {resellerDiscountTotal > 0 &&
                state?.serviceType === 'toktokfood' &&
                amountComponent('Discount', 'Reseller', resellerDiscountTotal, '-')}
              {promoDiscounts > 0 &&
                voucherDiscounts.map(voucher =>
                  amountComponent('Discount', voucher?.voucherName, voucher?.discountAmount, '-'),
                )}
              {shippingDiscount > 0 &&
                amountComponent('Discount', state?.promoDetails?.shippingDiscountName, shippingDiscount, '-')}
              {state?.serviceType === 'pabili' &&
                amountComponent('Discount', 'Service Fee (Reseller)', serviceFeeDiscount, '-')}
            </React.Fragment>
          )}
        </React.Fragment>
      );
    }
  };

  const renderTotalAmountComponent = () => {
    let icon;
    const serviceFee = pabiliShopResellerDiscount || state?.totalServiceFee;
    if (
      resellerDiscountTotal ||
      promoDiscounts ||
      shippingDiscount ||
      originalShippingFee ||
      pabiliShopResellerDiscount
    ) {
      icon = showAmountBreakdown ? 'chevron-down' : 'chevron-up';
    }
    return amountComponent(
      '',
      'Total',
      (state?.serviceType === 'toktokfood' ? state?.totalAmount : state?.srpTotalamount) +
        state?.originalShippingFee -
        shippingDiscount +
        (state?.serviceType === 'pabili' ? serviceFee : 0),
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
          {state?.serviceType === 'pabili' &&
            amountComponent('', 'Service Fee', state?.totalServiceFee || 'WAIVED', '', 'info', () =>
              setIsAlertVisible(true),
            )}
          {renderDiscountComponent()}
        </AmountBreakdownContainer>
      );
    }
    return null;
  };

  return (
    <Container>
      {renderAlertComponent()}
      {renderAmountBreakdownComponent()}
      {renderTotalAmountComponent()}
    </Container>
  );
};

export default OrderAmount;
