/**
 * @format
 * @flow
 */

import React, {useMemo, useState, useCallback, useEffect} from 'react';

import type {PropsType} from './types';
import {BackgroundImage, Container, LoadingContainer, List, ReminderContainer} from './Styled';
import {RefreshControl} from 'react-native';

//SELF IMPORTS
import {
  HeaderBack,
  HeaderTitleRevamp,
  LoadingIndicator,
  SomethingWentWrong,
  TransferableAndNonTransferableBalance,
} from 'toktokwallet/components';
import {BankTransferBankList, BankTransferFavoriteList} from 'toktokwallet/compositions';

//GRAPHQL & HOOKS
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_HIGHLIGHTED_BANKS, GET_BANK_ACCOUNTS_PAGINATE} from 'toktokwallet/graphql';
const ToktokWalletBankTransferHome = (props: PropsType): React$Node => {
  const navigation = useNavigation();

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'Bank Transfer'} />,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [banks, setBanks] = useState([]);
  const [favoriteBankAccounts, setFavoriteBankAccounts] = useState([]);

  const [getHighlightedBanks, {error: banksError, loading: banksLoading}] = useLazyQuery(GET_HIGHLIGHTED_BANKS, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: () => {
      setRefreshing(false);
    },
    onCompleted: data => {
      let result = data.getHighlightedBanks.filter(o1 => !banks.some(o2 => o1.id === o2.id));
      if (result.length > 0 || data.getHighlightedBanks.length !== banks.length) {
        setBanks(data.getHighlightedBanks);
      }
      setRefreshing(false);
    },
  });

  const [getBankAccountsPaginate, {loading: getFavoritesLoading, error: getFavoritesError}] = useLazyQuery(
    GET_BANK_ACCOUNTS_PAGINATE,
    {
      fetchPolicy: 'network-only',
      client: TOKTOK_WALLET_GRAPHQL_CLIENT,
      onError: () => {
        setRefreshing(false);
      },
      onCompleted: data => {
        let result = data.getBankAccountsPaginate.edges.filter(
          o1 => !favoriteBankAccounts.some(o2 => o1.node.id === o2.node.id),
        );

        if (result.length > 0 || data.getBankAccountsPaginate.edges.length !== favoriteBankAccounts.length) {
          setFavoriteBankAccounts(data.getBankAccountsPaginate.edges);
        }
        setRefreshing(false);
      },
    },
  );

  useFocusEffect(
    useCallback(
      function getData() {
        getHighlightedBanks();
        getBankAccountsPaginate({
          variables: {
            input: {
              afterCursorId: null,
              afterCursorName: null,
            },
          },
        });
        setIsMounted(true);
      },
      [getHighlightedBanks, getBankAccountsPaginate],
    ),
  );

  const onRefresh = () => {
    setRefreshing(true);
    handleGetData();
  };

  const handleGetData = () => {
    getHighlightedBanks();
    getBankAccountsPaginate({
      variables: {
        input: {
          afterCursorId: null,
          afterCursorName: null,
        },
      },
    });
    setIsMounted(true);
  };

  const ListFavoriteComponent = useMemo(() => {
    return (
      <>
        <ReminderContainer>
          <TransferableAndNonTransferableBalance />
        </ReminderContainer>
        {favoriteBankAccounts.length > 0 && <BankTransferFavoriteList data={favoriteBankAccounts} />}
      </>
    );
  }, [favoriteBankAccounts]);

  const ListBillerTypesComponent = useMemo(() => {
    if (banks.length === 0) {
      return null;
    } else {
      return <BankTransferBankList billTypes={banks} navigation={navigation} />;
    }
  }, [banks, navigation]);

  if (banksError || getFavoritesError) {
    return (
      <Container>
        <SomethingWentWrong onRefetch={handleGetData} error={banksError ?? getFavoritesError} />
      </Container>
    );
  }
  return (
    <BackgroundImage>
      {((banksLoading && banks.length === 0) ||
        (getFavoritesLoading && favoriteBankAccounts.length === 0 && !isMounted)) &&
      !refreshing ? (
        <LoadingContainer>
          <LoadingIndicator isLoading={true} />
        </LoadingContainer>
      ) : (
        <List
          extraData={[favoriteBankAccounts, banks]}
          ListHeaderComponent={ListFavoriteComponent}
          ListFooterComponent={ListBillerTypesComponent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </BackgroundImage>
  );
};

export default ToktokWalletBankTransferHome;
