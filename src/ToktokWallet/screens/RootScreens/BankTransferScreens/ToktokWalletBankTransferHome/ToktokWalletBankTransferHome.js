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
import {GET_BILL_TYPES, GET_FAVORITES_BILLS_ITEMS} from 'toktokbills/graphql/model';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_HIGHLIGHTED_BANKS} from 'toktokwallet/graphql';
const ToktokWalletBankTransferHome = (props: PropsType): React$Node => {
  const navigation = useNavigation();

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'Bank Transfer'} />,
  });
  const [billTypes, setBillTypes] = useState([]);
  const [favoriteBills, setFavoriteBills] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [banks, setBanks] = useState([]);

  const [getHighlightedBanks, {error: banksError, loading: banksLoading}] = useLazyQuery(GET_HIGHLIGHTED_BANKS, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: data => {
      setBanks(data.getHighlightedBanks);
    },
  });

  const [getFavoriteBillsPaginate, {loading: getFavoritesLoading, error: getFavoritesError}] = useLazyQuery(
    GET_FAVORITES_BILLS_ITEMS,
    {
      fetchPolicy: 'network-only',
      client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
      onError: () => {
        setRefreshing(false);
      },
      onCompleted: data => {
        let result = data.getFavoriteBillsPaginate.edges.filter(
          o1 => !favoriteBills.some(o2 => o1.node.id === o2.node.id),
        );

        if (result.length > 0 || data.getFavoriteBillsPaginate.edges.length !== favoriteBills.length) {
          setFavoriteBills(data.getFavoriteBillsPaginate.edges);
        }
        setRefreshing(false);
      },
    },
  );

  useFocusEffect(
    useCallback(
      function getData() {
        getHighlightedBanks();
        getFavoriteBillsPaginate({
          variables: {
            input: {
              afterCursorId: null,
              afterCursorUpdatedAt: null,
            },
          },
        });
        setIsMounted(true);
      },
      [getHighlightedBanks, getFavoriteBillsPaginate],
    ),
  );

  const onRefresh = () => {
    setRefreshing(true);
    handleGetData();
  };

  const handleGetData = () => {
    getHighlightedBanks();
    getFavoriteBillsPaginate({
      variables: {
        input: {
          afterCursorId: null,
          afterCursorUpdatedAt: null,
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
        {favoriteBills.length > 0 && <BankTransferFavoriteList favoriteBills={favoriteBills} />}
      </>
    );
  }, [favoriteBills]);

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
      {((banksLoading && banks.length === 0) || (getFavoritesLoading && favoriteBills.length === 0 && !isMounted)) &&
      !refreshing ? (
        <LoadingContainer>
          <LoadingIndicator isLoading={true} />
        </LoadingContainer>
      ) : (
        <List
          extraData={[favoriteBills, banks]}
          ListHeaderComponent={ListFavoriteComponent}
          ListFooterComponent={ListBillerTypesComponent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </BackgroundImage>
  );
};

export default ToktokWalletBankTransferHome;
