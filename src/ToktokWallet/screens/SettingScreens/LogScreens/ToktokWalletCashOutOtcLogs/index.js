import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_CASH_OUT_OTC} from 'toktokwallet/graphql';
import {useSelector} from 'react-redux';
import {
  Separator,
  ModalPaginationLoading,
  CheckIdleState,
  SwipeDownToRefresh,
  NoData,
  LoadingIndicator,
} from 'toktokwallet/components';
import {HeaderBack, HeaderTitle} from 'src/revamp';
import CONSTANTS from 'common/res/constants';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useAlert} from 'src/hooks';
import {SomethingWentWrong} from 'src/components';
import {moderateScale} from 'toktokwallet/helper';

//FONTS & COLORS & IMAGES
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;

//COMPONENTS
import {CashOutOtcLog} from './Components';

export const ToktokWalletCashOutOtcLogs = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack color={COLOR.YELLOW} />,
    headerTitle: () => <HeaderTitle label={['Cash Out', '']} />,
  });

  const tokwaAccount = useSelector(state => state.toktokWallet);
  const [pageInfo, setPageInfo] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [records, setRecords] = useState([]);
  const alert = useAlert();

  const [getCashOutOtc, {loading: getCashOutOtcLoading, error: getCashOutOtcError, fetchMore}] = useLazyQuery(
    GET_CASH_OUT_OTC,
    {
      fetchPolicy: 'network-only',
      client: TOKTOK_WALLET_GRAPHQL_CLIENT,
      onError: error => {
        setRefreshing(false);
        onErrorAlert({alert, error, navigation});
      },
      onCompleted: ({getCashOutOtc}) => {
        setRefreshing(false);
        setRecords(getCashOutOtc.edges);
        setPageInfo(getCashOutOtc.pageInfo);
      },
    },
  );

  const Refetch = () => {
    handleGetCashOutOtc();
    setRefreshing(true);
  };

  useEffect(() => {
    handleGetCashOutOtc();
  }, []);

  const handleGetCashOutOtc = () => {
    getCashOutOtc({
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
          fetchMoreResult.getCashOutOtc.edges = [
            ...previousResult.getCashOutOtc.edges,
            ...fetchMoreResult.getCashOutOtc.edges,
          ];
          return fetchMoreResult;
        },
      }).then(({data}) => {
        setPageInfo(data.getCashOutOtc.pageInfo);
        setRecords(data.getCashOutOtc.edges);
      });
    }
  };

  const ListFooterComponent = () => {
    return (
      <View>
        <View style={{marginVertical: moderateScale(35)}}>
          <LoadingIndicator isLoading={pageInfo.hasNextPage} size="small" />
        </View>
      </View>
    );
  };

  if (getCashOutOtcLoading && !refreshing) {
    return (
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    );
  }

  return (
    <>
      <CheckIdleState>
        <Separator />
        {/* <SwipeDownToRefresh/> */}
        {/* <ModalPaginationLoading visible={pageLoading} /> */}
        {
          // loading && pageIndex == 0
          // ?  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          //     <ActivityIndicator size={24} color={COLOR.YELLOW} />
          //    </View>
          // :
          <View style={styles.container}>
            <View style={styles.content}>
              <FlatList
                ListEmptyComponent={() => {
                  if (records.length > 0) return null;
                  if (getCashOutOtcLoading) return null;
                  return <NoData />;
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={Refetch}
                    colors={[COLOR.YELLOW]}
                    tintColor={COLOR.YELLOW}
                  />
                }
                showsVerticalScrollIndicator={false}
                data={records}
                keyExtractor={item => item.id}
                renderItem={({item, index}) => (
                  <CashOutOtcLog
                    key={`cashoutotc-log${index}`}
                    item={item.node}
                    index={index}
                    tokwaAccount={tokwaAccount}
                  />
                )}
                onEndReachedThreshold={0.02}
                onEndReached={fetchMoreData}
                ListFooterComponent={ListFooterComponent}
                scrollEnabled={true}
                contentContainerStyle={{paddingHorizontal: moderateScale(16)}}
              />
            </View>
          </View>
        }
      </CheckIdleState>
    </>
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
    padding: 16,
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
    marginVertical: 0,
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
