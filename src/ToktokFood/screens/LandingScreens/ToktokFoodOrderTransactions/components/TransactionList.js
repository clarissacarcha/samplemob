import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, StyleSheet, Text, FlatList, RefreshControl, Image, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import { TransactionItems, VerifyContext } from '../components';
// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';
// Utils
import {getStatusbarHeight, scale, moderateScale, verticalScale} from 'toktokfood/helper/scale';
import {empty_orders} from 'toktokfood/assets/images';
import {useIsFocused} from '@react-navigation/native';
// API
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_ORDER_TRANSACTIONS} from 'toktokfood/graphql/toktokfood';
import {useSelector} from 'react-redux';
import { getOrderStatus, getSubMessageStatus, sameDay, dayTitle } from '../functions';

const renderEmpty = () => (
  <View style={styles.emptyContainer}>
    <Image style={styles.emptyImg} resizeMode="contain" source={empty_orders} />
    <Text style={styles.emptyText}>You don't have orders yet</Text>
  </View>
);
export const TransactionList = (props) => {

  const navigation = useNavigation();
  // const { data, loading, error, refreshing, onRefresh, loadMore } = props
  const [refreshing, setRefreshing] = useState(false);
  const isFocus = useIsFocused();
  const { customerInfo } = useSelector((state) => state.toktokFood);
  const [tempTransactions, setTempTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [loadMore, setLoadMore] = useState(false);
  const [pendingProcess, setPendingProcess] = useState(false);
  const { focusTab, transactionList, setTransactionList } = useContext(VerifyContext);

  // data fetching for product under specific category
  const [getOrderTransactions, {data, error, loading, fetchMore}] = useLazyQuery(GET_ORDER_TRANSACTIONS, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({ getTransactions }) => {
      console.log('ddf')
      setTransactionList(getTransactions)
    }
  });
 
  useEffect(() => {
    if(customerInfo && isFocus){
      processTransactions()
    }
  }, [customerInfo, focusTab, isFocus])

  useEffect(() => {
    if (page != 0 && data && data.getTransactions.length > 0) {
      let orderStatus = getOrderStatus(focusTab)
      fetchMore({
        variables: {
          input: {
            userId: `${customerInfo.userId}`,
            orderStatus: orderStatus,
            page: page,
            limit: 10,
          },
        },
        updateQuery: (previousResult, {fetchMoreResult}) => {
          if (!fetchMoreResult) {
            return previousResult;
          }
          return {getTransactions: [...previousResult.getTransactions, ...fetchMoreResult.getTransactions]};
        },
      });
    }
  }, [page]);

  useEffect(() => {
    if(data){
      if(JSON.stringify(data) != JSON.stringify(tempTransactions)){
        setTempTransactions(data)
        setPendingProcess(true)
      } else {
        setPendingProcess(false)
      }
      setTimeout(() => {
        setLoadMore(false)
      }, 3000)
    }
  }, [data, page]);

  const processTransactions = () => {
    setTempTransactions([])
    setPage(0)
    let orderStatus = getOrderStatus(focusTab)
    getOrderTransactions({
      variables: {
        input: {
          userId: `${customerInfo.userId}`,
          orderStatus: orderStatus,
          page: 0,
          limit: 10
        }
      },
    })
    setRefreshing(false)
  }

  const onRefresh = () => {
    setRefreshing(true)
    processTransactions()
  }

  const handleLoadMore = () => {
    if(!loadMore && pendingProcess){
      setPage((prev) => prev + 1)
      setLoadMore(true)
    }
  }

  const renderFooter = () => <LoadingIndicator isFlex isLoading={loadMore} />;

  return (
    <View style={styles.listContainer}>
      { ((loading || error) || data == undefined) ? (
        <LoadingIndicator isFlex isLoading={true} />
      ) : (
        <FlatList
          data={data ? data.getTransactions : []} // data ? data.getTransactions : []
          renderItem={({ item, index }) => 
            <TransactionItems
              item={item}
              index={index}
              data={data.getTransactions}
              focusTab={focusTab}
            />
          }
          contentContainerStyle={{
            paddingBottom: Platform.OS == 'android' ? verticalScale(20) : 0,
            flexGrow: 1
          }}
          extraData={{ loadMore, data }}
          keyExtractor={(val, index) => index.toString()}
          onEndReachedThreshold={.5}
          onEndReached={() => handleLoadMore()}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={() => ( <LoadingIndicator isLoading={loadMore} /> )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    paddingTop: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyImg: {
    height: moderateScale(175),
    width: moderateScale(250),
  },
  emptyText: {
    color: '#9E9E9E',
    fontSize: FONT_SIZE.XL,
    marginTop: moderateScale(20),
  },
});

