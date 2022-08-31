/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container, ContentContainer, CellContainer, ContentText, PaymentRangesContainer} from './Styled';
import {numFormatter} from 'toktokwallet/helper';

const TableContent = (props: PropsType): React$Node => {
  const {data} = props;
  return (
    <Container>
      {data.map((details, index) => {
        return (
          <ContentContainer index={index}>
            <CellContainer width="25%">
              <ContentText>{details.partnerName}</ContentText>
            </CellContainer>
            <CellContainer width="100%">
              {details.paymentChartRanges.map((range, ind) => {
                const {from, to, fee, toktokServiceFee, rate} = range;
                const computedFee = `${parseFloat(fee) + parseFloat(toktokServiceFee)} + ${rate}%`;

                return (
                  <PaymentRangesContainer index={ind} lastItemIndex={details.paymentChartRanges.length - 1}>
                    <CellContainer width="30%">
                      <ContentText>
                        ₱{numFormatter(from)} - ₱{numFormatter(to)}
                      </ContentText>
                    </CellContainer>
                    <CellContainer width="14%">
                      <ContentText isTextCenter={details.partnerType.name !== 'Over the Counter'}>
                        {details.partnerType.name === 'Over the Counter' ? `₱${computedFee}` : '--'}
                      </ContentText>
                    </CellContainer>
                    <CellContainer width="14%">
                      <ContentText isTextCenter={details.partnerType.name !== 'Online Bank'}>
                        {details.partnerType.name === 'Online Bank' ? `₱${computedFee}` : '--'}
                      </ContentText>
                    </CellContainer>
                    <CellContainer width="17%">
                      <ContentText isTextCenter={details.partnerType.name !== 'Payment thru Mobile/E-Wallet'}>
                        {details.partnerType.name === 'Payment thru Mobile/E-Wallet' ? `₱${computedFee}` : '--'}
                      </ContentText>
                    </CellContainer>
                  </PaymentRangesContainer>
                );
              })}
            </CellContainer>
          </ContentContainer>
        );
      })}
    </Container>
  );
};

export default TableContent;
