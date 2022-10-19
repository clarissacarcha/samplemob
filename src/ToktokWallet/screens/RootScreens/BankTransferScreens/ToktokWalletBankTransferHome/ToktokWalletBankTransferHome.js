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
  CheckIdleState,
  HeaderBack,
  HeaderTitleRevamp,
  LoadingIndicator,
  SomethingWentWrong,
  TransferableAndNonTransferableBalance,
} from 'toktokwallet/components';
import {BankTransferBankList, BankTransferFavoriteList} from 'toktokwallet/compositions';

//GRAPHQL & HOOKS
import {useLazyQuery} from '@apollo/react-hooks';
import {useNavigation, useFocusEffect, useRoute} from '@react-navigation/native';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_HIGHLIGHTED_BANKS, GET_BANK_ACCOUNTS_PAGINATE} from 'toktokwallet/graphql';

const ToktokWalletBankTransferHome = (props: PropsType): React$Node => {
  const navigation = useNavigation();
  const route = useRoute();
  const screenLabel = route.params?.screenLabel ? route.params.screenLabel : 'Bank Transfer';

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={screenLabel} />,
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
      setBanks(data.getHighlightedBanks);
      setRefreshing(false);
      setIsMounted(true);
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
        setFavoriteBankAccounts(data.getBankAccountsPaginate.edges);
        setRefreshing(false);
        setIsMounted(true);
      },
    },
  );

  // useFocusEffect(
  //   useCallback(
  //     function getData() {
  //       getBankAccountsPaginate({
  //         variables: {
  //           input: {
  //             afterCursorId: null,
  //             afterCursorUpdatedAt: null,
  //           },
  //         },
  //       });
  //     },
  //     [getBankAccountsPaginate],
  //   ),
  // );

  useEffect(() => {
    handleGetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleGetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetData = () => {
    getHighlightedBanks();
    getBankAccountsPaginate({
      variables: {
        input: {
          afterCursorId: null,
          afterCursorUpdatedAt: null,
        },
      },
    });
  };

  const ListFavoriteComponent = useMemo(() => {
    return (
      <>
        <ReminderContainer>
          <TransferableAndNonTransferableBalance />
        </ReminderContainer>
        {favoriteBankAccounts.length > 0 && (
          <BankTransferFavoriteList
            data={favoriteBankAccounts}
            onRefreshFavorite={onRefresh}
            screenLabel={screenLabel}
          />
        )}
      </>
    );
  }, [favoriteBankAccounts, onRefresh, screenLabel]);

  const ListBillerTypesComponent = useMemo(() => {
    if (banks.length === 0) {
      return null;
    } else {
      return (
        <BankTransferBankList
          data={banks}
          navigation={navigation}
          screenLabel={screenLabel}
          onRefreshFavorite={onRefresh}
        />
      );
    }
  }, [banks, navigation, screenLabel, onRefresh]);

  if (banksError || getFavoritesError) {
    return (
      <Container>
        <SomethingWentWrong onRefetch={handleGetData} error={banksError ?? getFavoritesError} />
      </Container>
    );
  }
  return (
    <CheckIdleState>
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
    </CheckIdleState>
  );
};

export default ToktokWalletBankTransferHome;
