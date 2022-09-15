import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_FUND_TRANSFER} from 'toktokwallet/graphql';
import {useSelector} from 'react-redux';
import {
  Separator,
  CheckIdleState,
  LoadingIndicator,
  NoData,
  HeaderBack,
  HeaderTitleRevamp,
} from 'toktokwallet/components';
import {moderateScale} from 'toktokwallet/helper';
import CONSTANTS from 'common/res/constants';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useAlert} from 'src/hooks';
import {SomethingWentWrong} from 'src/components';

//SELF IMPORT
import {CashOutLog} from './Components';

const {COLOR} = CONSTANTS;

export const ToktokWalletCashOutLogs = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'Fund Transfer'} />,
  });

  const tokwaAccount = useSelector(state => state.toktokWallet);
  const [records, setRecords] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const onEndReachedCalledDuringMomentum = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const alert = useAlert();

  const [getFundTransfer, {data, error, loading, fetchMore}] = useLazyQuery(GET_FUND_TRANSFER, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: error => {
      setRefreshing(false);
      onErrorAlert({alert, error, navigation});
    },
    onCompleted: ({getFundTransfer}) => {
      setRecords(getFundTransfer.edges);
      setPageInfo(getFundTransfer.pageInfo);
      setRefreshing(false);
    },
  });

  const handleGetTransactions = () => {
    getFundTransfer({
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
          fetchMoreResult.getFundTransfer.edges = [
            ...previousResult.getFundTransfer.edges,
            ...fetchMoreResult.getFundTransfer.edges,
          ];
          return fetchMoreResult;
        },
      }).then(({data}) => {
        setPageInfo(data.getFundTransfer.pageInfo);
        setRecords(data.getFundTransfer.edges);
      });
    }
  };

  const Refetch = () => {
    handleGetTransactions();
    setRefreshing(loading);
  };

  useEffect(() => {
    handleGetTransactions();
    setRefreshing(loading);
  }, []);

  if (error) {
    return <SomethingWentWrong onRefetch={Refetch} />;
  }

  const ListFooterComponent = () => {
    return (
      <View style={{marginVertical: moderateScale(15)}}>
        <LoadingIndicator isLoading={pageInfo.hasNextPage} size="small" />
      </View>
    );
  };

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
                <CashOutLog
                  data={records}
                  key={`cashin-log${index}`}
                  item={item?.node}
                  index={index}
                  tokwaAccount={tokwaAccount}
                />
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
});
