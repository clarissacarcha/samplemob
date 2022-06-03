/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container, Title, Text} from './Styled';
import Divider from 'toktokfood/components/Divider';

const OrderNote = (props: PropsType): React$Node => {
  const {state} = props;
  return (
    <React.Fragment>
      <Container>
        <Title>Note to Driver</Title>
        <Text>{state?.notes}</Text>
        <Divider />
      </Container>
    </React.Fragment>
  );
};

export default OrderNote;
