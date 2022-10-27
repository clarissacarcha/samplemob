import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_MERCHANT_PAYMENTS_PAGINATE} from 'toktokwallet/graphql';
import {useSelector} from 'react-redux';
import {
  Separator,
  CheckIdleState,
  LoadingIndicator,
  NoData,
  HeaderBack,
  HeaderTitleRevamp,
} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useAlert} from 'src/hooks';
import {SomethingWentWrong} from 'src/components';
import {moderateScale} from 'toktokwallet/helper';

//SELF IMPORT
import {LogItem} from './Components';

const {COLOR} = CONSTANTS;

export const ToktokWalletMerchantPaymentLogs = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'QR Payment'} />,
  });

  const tokwaAccount = useSelector(state => state.toktokWallet);
  const [records, setRecords] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const onEndReachedCalledDuringMomentum = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const alert = useAlert();

  const [getMerchantPaymentsPaginate, {date, error, loading, fetchMore}] = useLazyQuery(
    GET_MERCHANT_PAYMENTS_PAGINATE,
    {
      fetchPolicy: 'network-only',
      client: TOKTOK_WALLET_GRAPHQL_CLIENT,
      onError: error => {
        setRefreshing(false);
        onErrorAlert({alert, error, navigation});
      },
      onCompleted: ({getMerchantPaymentsPaginate}) => {
        setRecords(getMerchantPaymentsPaginate.edges);
        setPageInfo(getMerchantPaymentsPaginate.pageInfo);
        setRefreshing(false);
      },
    },
  );

  const handleGetTransactions = () => {
    getMerchantPaymentsPaginate({
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
          fetchMoreResult.getMerchantPaymentsPaginate.edges = [
            ...previousResult.getMerchantPaymentsPaginate.edges,
            ...fetchMoreResult.getMerchantPaymentsPaginate.edges,
          ];
          return fetchMoreResult;
        },
      }).then(({data}) => {
        setPageInfo(data.getMerchantPaymentsPaginate.pageInfo);
        setRecords(data.getMerchantPaymentsPaginate.edges);
      });
    }
  };

  const Refetch = () => {
    handleGetTransactions();
    setRefreshing(true);
  };

  useEffect(() => {
    handleGetTransactions();
    setRefreshing(loading);
  }, []);

  const ListFooterComponent = () => {
    return (
      <View style={{marginVertical: moderateScale(15)}}>
        <LoadingIndicator isLoading={pageInfo.hasNextPage} size="small" />
      </View>
    );
  };

  if (error) {
    return <SomethingWentWrong onRefetch={Refetch} />;
  }

  return (
    <CheckIdleState>
      <Separator />
      {
        <View style={styles.container}>
          <View style={styles.content}>
            <FlatList
              ListEmptyComponent={() => {
                if (records.length > 0) return null;
                if (loading) return null;
                return <NoData />;
              }}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={Refetch}
                  colors={[COLOR.YELLOW]}
                  tintColor={COLOR.YELLOW}
                />
              }
              showsVerticalScrollIndicator={false}
              data={records}
              keyExtractor={item => item.id}
              renderItem={({item, index}) => (
                <LogItem key={index} item={item?.node} index={index} tokwaAccount={tokwaAccount} data={records} />
              )}
              contentContainerStyle={{flexGrow: 1}}
              onEndReachedThreshold={0.01}
              onEndReached={() => {
                if (!onEndReachedCalledDuringMomentum.current) {
                  fetchMoreData();
                  onEndReachedCalledDuringMomentum.current = true;
                }
              }}
              onMomentumScrollBegin={() => {
                onEndReachedCalledDuringMomentum.current = false;
              }}
              scrollEnabled={true}
              getItemLayout={
                records.length <= 30
                  ? (data, index) => ({
                      length: records.length,
                      offset: records.length * index,
                      index,
                    })
                  : undefined
              }
              ListFooterComponent={ListFooterComponent}
            />
          </View>
        </View>
      }
    </CheckIdleState>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  filterType: {
    alignSelf: 'flex-end',
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 10,
  },
  transactionLogsContainer: {
    marginVertical: 5,
  },
  transaction: {
    paddingVertical: 10,
    borderBottomWidth: 0.2,
    borderColor: 'silver',
    flexDirection: 'row',
  },
  transactionIcon: {
    flexBasis: 50,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 5,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionAmount: {
    flexBasis: 'auto',
    alignItems: 'flex-end',
  },
  separator: {
    backgroundColor: '#F4F4F4',
    height: 1,
  },
});
