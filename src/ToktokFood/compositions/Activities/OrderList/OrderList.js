/**
 * @format
 * @flow
 */

import React, {useMemo} from 'react';
import type {PropsType} from './types';
import {List, Separator, EmptyListContainer, Image, Title, Container} from './Styled';
import OrderCard from '../OrderCard';
import {empty_activities} from 'toktokfood/assets/images';
import StyledText from 'toktokfood/components/StyledText';

const OrderList = (props: PropsType): React$Node => {
  const {data} = props;

  const EmptyListComponent = useMemo(
    () => () =>
      (
        <Container>
          <EmptyListContainer>
            <Image source={empty_activities} />
            <Title>No Orders</Title>
            <StyledText>Go browse and order something you like!</StyledText>
          </EmptyListContainer>
        </Container>
      ),
    [],
  );

  return (
    <List
      {...props}
      data={data}
      keyExtractor={item => item.id}
      renderItem={({item}) => <OrderCard data={item} key={item.id} />}
      ListEmptyComponent={<EmptyListComponent />}
      ItemSeparatorComponent={() => <Separator />}
    />
  );
};

export default OrderList;
