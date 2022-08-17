import React, {useState, useRef, useEffect, useMemo} from 'react';
import {
  FlatList,
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  RefreshControl,
} from 'react-native';
import {LoadingIndicator, ActivityCard, SomethingWentWrong, EmptyList} from 'toktokbills/components';
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';
import {useScrollToTop} from '@react-navigation/native';

//HELPER
import {moderateScale, numberFormat} from 'toktokbills/helper';
import moment from 'moment';

//IMAGES
import {wallet_icon} from 'src/ToktokLoad/assets/icons';
import {empty_activities} from 'src/ToktokLoad/assets/images';

//GRAPHQL & HOOKS
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_BILL_TRANSACTIONS_PAGINATE} from 'toktokbills/graphql/model';

const {width, height} = Dimensions.get('window');

const ListEmptyComponent = () => {
  return (
    <View style={styles.container}>
      <EmptyList imageSrc={empty_activities} label="No Activities" message="You have no activities at the moment." />
    </View>
  );
};

const ListFooterComponent = ({hasNextPage}) => {
  return (
    <View style={{marginTop: moderateScale(15)}}>
      <LoadingIndicator isLoading={hasNextPage} size="small" />
    </View>
  );
};

export const ToktokBillsFailedActivities = ({navigation}) => {
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [pageInfo, setPageInfo] = useState({});
  const listRef = useRef(null);

  useScrollToTop(listRef); // scroll to top

  const [getTransactionsPaginate, {loading, error, fetchMore}] = useLazyQuery(GET_BILL_TRANSACTIONS_PAGINATE, {
    fetchPolicy: 'network-only',
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: () => {
      changeStates();
    },
    onCompleted: ({getTransactionsPaginate}) => {
      setTransactions(getTransactionsPaginate.edges);
      setPageInfo(getTransactionsPaginate.pageInfo);
      changeStates();
    },
  });

  useEffect(() => {
    handleGetTransactionsPaginate();
  }, []);

  const changeStates = () => {
    setRefreshing(false);
    setIsMounted(true);
  };

  const onPressActivityCard = item => {
    navigation.navigate('ToktokBillsActivityDetails', {activityDetails: item.node});
  };

  const onRefresh = () => {
    setRefreshing(true);
    handleGetTransactionsPaginate();
  };

  const handleGetTransactionsPaginate = () => {
    getTransactionsPaginate({
      variables: {
        input: {
          service: 'BILLS',
          status: 'FAILED',
          afterCursorId: null,
        },
      },
    });
  };


  const fetchMoreData = () => {
    if (pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          input: {
            service: 'BILLS',
            status: 'FAILED',
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
        setTransactions(data.getTransactionsPaginate.edges);
      });
    }
  };

  const FailedActivities = useMemo(() => {
    return (
      <FlatList
        data={transactions}
        renderItem={({item, index}) => (
          <ActivityCard
            item={item.node}
            onPress={() => onPressActivityCard(item)}
            isLastItem={transactions.length - 1 == index}
          />
        )}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(val, index) => index.toString()}
        contentContainerStyle={{...styles.flatlistContainer, ...(transactions.length == 0 ? {flexGrow: 1} : {})}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLOR.YELLOW]}
            tintColor={COLOR.YELLOW}
          />
        }
        ListEmptyComponent={ListEmptyComponent}
        ref={listRef}
        ListFooterComponent={() => <ListFooterComponent hasNextPage={pageInfo.hasNextPage} />}
        onEndReachedThreshold={0.02}
        onEndReached={() => fetchMoreData()}
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={10}
      />
    );
  }, [transactions, refreshing, pageInfo]);

  if ((loading && transactions.length == 0) || !isMounted) {
    return (
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={onRefresh} error={error} />
      </View>
    );
  }

  return <View style={styles.container}>{FailedActivities}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatlistContainer: {
    padding: moderateScale(16),
    backgroundColor: '#fff',
  },
  shadow: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabContainer: {
    marginBottom: moderateScale(16),
    borderRadius: moderateScale(5),
  },
  tokwaButtonTextWrapper: {
    flexDirection: 'row',
  },
  toktokText: {
    color: COLOR.YELLOW,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
  },
  walletText: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
  },
  detailOneContainer: {
    padding: moderateScale(16),
    backgroundColor: '#FBFAE3',
  },
  subText: {
    color: '#525252',
    fontSize: FONT_SIZE.S,
  },
  detailTwoContainer: {
    padding: moderateScale(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkIcon: {
    width: moderateScale(40),
    height: moderateScale(20),
    resizeMode: 'contain',
  },
  divider: {
    backgroundColor: '#F8F8F8',
    height: 2,
    marginHorizontal: moderateScale(16),
  },
  detailThreeContainer: {
    padding: moderateScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
    resizeMode: 'contain',
  },
  totalAmount: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.BOLD,
  },
});
