/**
 * @format
 * @flow
 */

import React, {useMemo, useState, useCallback} from 'react';

import type {PropsType} from './types';
import {BackgroundImage, Container, LoadingContainer, List} from './Styled';
import {RefreshControl} from 'react-native';

//SELF IMPORTS
import {HeaderBack, HeaderTitle, LoadingIndicator, SomethingWentWrong} from 'toktokbills/components';
import {BillerTypeList, FavoriteList} from 'toktokbills/compositions';

//GRAPHQL & HOOKS
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_BILL_TYPES, GET_FAVORITES_BILLS_ITEMS} from 'toktokbills/graphql/model';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const ToktokBillsHome = (props: PropsType): React$Node => {
  const navigation = useNavigation();

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['toktokbills']} isLogo />,
  });
  const [billTypes, setBillTypes] = useState([]);
  const [favoriteBills, setFavoriteBills] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const [getBillTypes, {loading, error}] = useLazyQuery(GET_BILL_TYPES, {
    fetchPolicy: 'network-only',
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: () => {
      setRefreshing(false);
    },
    onCompleted: data => {
      let result = data.getBillTypes.filter(o1 => !billTypes.some(o2 => o1.id === o2.id));
      if (result.length > 0 || data.getBillTypes.length !== billTypes.length) {
        setBillTypes(data.getBillTypes);
      }
      setRefreshing(false);
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
        getBillTypes();
        getFavoriteBillsPaginate({
          variables: {
            input: {
              afterCursorId: null,
              afterCursorUpdatedAt: null,
            },
          },
        });
        setShowMore(true);
        setIsMounted(true);
      },
      [getBillTypes, getFavoriteBillsPaginate],
    ),
  );

  const onRefresh = () => {
    setRefreshing(true);
    handleGetData();
  };

  const handleGetData = () => {
    getBillTypes();
    getFavoriteBillsPaginate({
      variables: {
        input: {
          afterCursorId: null,
          afterCursorUpdatedAt: null,
        },
      },
    });
    setShowMore(true);
    setIsMounted(true);
  };

  const ListFavoriteComponent = () => {
    if (favoriteBills.length === 0) {
      return null;
    } else {
      return <FavoriteList favoriteBills={favoriteBills} />;
    }
  };

  const ListBillerTypesComponent = useMemo(() => {
    if (billTypes.length === 0) {
      return null;
    } else {
      return <BillerTypeList billTypes={billTypes} showMore={showMore} setShowMore={setShowMore} />;
    }
  }, [billTypes, showMore]);

  if (error || getFavoritesError) {
    return (
      <Container>
        <SomethingWentWrong onRefetch={handleGetData} error={error ?? getFavoritesError} />
      </Container>
    );
  }
  return (
    <BackgroundImage>
      {((loading && billTypes.length === 0) || (getFavoritesLoading && favoriteBills.length === 0 && !isMounted)) &&
      !refreshing ? (
        <LoadingContainer>
          <LoadingIndicator isLoading={true} />
        </LoadingContainer>
      ) : (
        <List
          extraData={[favoriteBills, billTypes]}
          ListHeaderComponent={ListFavoriteComponent}
          ListFooterComponent={ListBillerTypesComponent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </BackgroundImage>
  );
};

export default ToktokBillsHome;
