/**
 * @format
 * @flow
 */

import React, {useEffect, useState} from 'react';
import type {PropsType} from './types';
import {Container, List} from './Styled';
//GRAPHQL
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_ACCOUNT_TYPES} from 'toktokwallet/graphql';
import {useNavigation} from '@react-navigation/native';
//COMPONENTS
import {
  HeaderBack,
  HeaderTitleRevamp,
  CheckIdleState,
  LoadingIndicator,
  SomethingWentWrong,
} from 'toktokwallet/components';
//COMPOSITIONS
import {AccountTypeLimit} from 'toktokwallet/compositions';

const ToktokWalletTransactionLimit = (props: PropsType): React$Node => {
  const navigation = useNavigation();

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'User Level and Transaction Limit'} />,
  });

  const [accountTypes, setAccountTypes] = useState([]);

  const [getAccountTypes, {error, loading}] = useLazyQuery(GET_ACCOUNT_TYPES, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: data => {
      setAccountTypes(data.getAccountTypes);
    },
  });

  useEffect(() => {
    getAccountTypes();
  }, [getAccountTypes]);

  if (loading) {
    return (
      <Container>
        <LoadingIndicator isLoading={true} size={'small'} isFlex />
      </Container>
    );
  }
  if (error) {
    return (
      <Container>
        <SomethingWentWrong error={error} onRefetch={getAccountTypes} />
      </Container>
    );
  }
  return (
    <CheckIdleState>
      <List
        data={accountTypes}
        renderItem={({item, index}) => <AccountTypeLimit item={item} index={index} />}
        keyExtractor={item => item.id}
      />
    </CheckIdleState>
  );
};

export default ToktokWalletTransactionLimit;
