/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container, ContentContainer, ServiceText} from './Styled';
import TableHeader from '../TableHeader';
import TableContent from '../TableContent';

const CustomTable = (props: PropsType): React$Node => {
  const {data} = props;
  const headerData = ['Partner', 'Payment Range', 'OTC Fee', 'Online Bank Fee', 'Payment through mobile'];
  return (
    <Container>
      {data.map(item => {
        const {paymentChart} = item;
        if (paymentChart.length === 0) {
          return null;
        }
        return (
          <ContentContainer>
            <ServiceText>{item.description}</ServiceText>
            <TableHeader data={headerData} />
            <TableContent data={paymentChart} />
          </ContentContainer>
        );
      })}
    </Container>
  );
};

export default CustomTable;
