import React, {useState, useEffect} from 'react';
import {View, FlatList, Text, TouchableWithoutFeedback, Image, StyleSheet, Platform, RefreshControl} from 'react-native';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_ORDER_TRANSACTIONS} from 'toktokfood/graphql/toktokfood';
import {useSelector} from 'react-redux';

// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';
import { time } from 'toktokfood/assets/images';

// Strings
import {transactions} from 'toktokfood/helper/strings';

// Components
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import { TransactionTabs, TransactionList } from './components';
import {useIsFocused} from '@react-navigation/native';

// Functions
import { getOrderStatus, getSubMessageStatus, sameDay, dayTitle } from './functions';

import {useNavigation} from '@react-navigation/native';

// Utils
import {verticalScale, moderateScale, scale, getStatusbarHeight} from 'toktokfood/helper/scale';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
  bgImage: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
};

const ToktokFoodOrderTransactions = () => {
  const navigation = useNavigation();

  const [focusTab, setFocusTab] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [transactionList, setTransactionList] = useState([]);
  const isFocus = useIsFocused();
  const { customerInfo } = useSelector((state) => state.toktokFood);

  // data fetching for product under specific category
  const [getOrderTransactions, {data, error, loading }] = useLazyQuery(GET_ORDER_TRANSACTIONS, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({ getTransactions }) => {
      let sorted = getTransactions.sort((a, b) => b.dateOrdered.localeCompare(a.dateOrdered))
      setTransactionList(sorted)
    }
  });
 
  useEffect(() => {
    if(customerInfo && isFocus){
      processTransactions()
    }
  }, [customerInfo, focusTab, isFocus])

  const processTransactions = () => {
    let orderStatus = getOrderStatus(focusTab)
    getOrderTransactions({
      variables: {
        input: {
          userId: `${customerInfo.userId}`,
          orderStatus: orderStatus
        }
      },
    })
    setRefreshing(false)
  }

  const onRefresh = () => {
    setRefreshing(true)
    processTransactions()
  }

  return (
    <>
      <View style={styles.container}>
        <HeaderImageBackground customSize={CUSTOM_HEADER}>
          <HeaderTitle titleOnly showAddress={false} title="Food Orders" />
        </HeaderImageBackground>
        <TransactionTabs focusTab={focusTab} setFocusTab={setFocusTab} />
        <TransactionList
          data={transactionList}
          loading={loading}
          error={error}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  }
});

export default ToktokFoodOrderTransactions;
