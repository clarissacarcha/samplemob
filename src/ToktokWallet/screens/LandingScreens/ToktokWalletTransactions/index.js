import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {moderateScale} from 'toktokwallet/helper';

//COMPONENTS
import {
  Separator,
  WalletLog,
  CheckIdleState,
  SwipeDownToRefresh,
  NoData,
  TransactionLog,
  LoadingIndicator,
  HeaderBack,
  HeaderTitleRevamp,
} from 'toktokwallet/components';

//HOOKS
import {useAlert} from 'src/hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_TRANSACTIONS_PAGINATE} from 'toktokwallet/graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import {connect} from 'react-redux';

//ASSETS
import CONSTANTS from 'common/res/constants';
const {COLOR} = CONSTANTS;

const mapDispatchtoProps = dispatch => ({
  getTokwaTransactions: payload =>
    dispatch({
      type: 'SET_TOKTOKWALLET_TRANSACTIONS',
      payload: payload,
    }),
});

export const ToktokWalletTransactions = connect(
  null,
  mapDispatchtoProps,
)(({navigation, route, getTokwaTransactions}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'Transactions'} />,
  });

  const [allTransactions, setAllTransactions] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const alert = useAlert();

  const [getTransactionsPaginate, {data, error, loading, fetchMore}] = useLazyQuery(GET_TRANSACTIONS_PAGINATE, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({getTransactionsPaginate}) => {
      setAllTransactions(getTransactionsPaginate.edges);
      setPageInfo(getTransactionsPaginate.pageInfo);
      setRefreshing(false);
    },
    onError: error => {
      setRefreshing(false);
      onErrorAlert({alert, error, navigation});
    },
  });

  const Refetch = () => {
    setRefreshing(true);
    handleGetTransactionsPaginate();
  };

  useEffect(() => {
    handleGetTransactionsPaginate();
  }, []);

  const handleGetTransactionsPaginate = () => {
    getTransactionsPaginate({
      variables: {
        input: {
          afterCursorId: null,
        },
      },
    });
  };

  const fetchMoreData = async () => {
    if (pageInfo.hasNextPage) {
      await fetchMore({
        variables: {
          input: {
            afterCursorId: pageInfo.endCursorId,
          },
        },
        updateQuery: (previousResult, {fetchMoreResult}) => {
          if (!fetchMoreResult) {
            return previousResult;
          }
          fetchMoreResult.getTransactionsPaginate.edges = [
            ...previousResult.getTransactionsPaginate.edges,
            ...fetchMoreResult.getTransactionsPaginate.edges,
          ];
          return fetchMoreResult;
        },
      }).then(({data}) => {
        setPageInfo(data.getTransactionsPaginate.pageInfo);
        setAllTransactions(data.getTransactionsPaginate.edges);
      });
    }
  };

  const ListFooterComponent = () => {
    return (
      <View style={{marginTop: moderateScale(15)}}>
        <LoadingIndicator isLoading={pageInfo.hasNextPage} size="small" />
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    );
  }
  return (
    <CheckIdleState>
      <View style={styles.container}>
        <FlatList
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={Refetch} />}
          showsVerticalScrollIndicator={false}
          data={allTransactions}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => (
            <TransactionLog key={`walletLogs${index}`} transaction={item} index={index} data={allTransactions} />
          )}
          onEndReachedThreshold={0.02}
          onEndReached={fetchMoreData}
          ListFooterComponent={ListFooterComponent}
          getItemLayout={(data, index) => ({
            length: data.length,
            offset: data.length * index,
            index,
          })}
          scrollEnabled={true}
          contentContainerStyle={{padding: moderateScale(16)}}
        />
      </View>
    </CheckIdleState>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  logs: {
    // marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  filterType: {
    alignSelf: 'flex-end',
    padding: 2,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 5,
  },
});
