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
import { TransactionTabs, TransactionList, VerifyContext, VerifyContextProvider } from './components';
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

const MainComponent = () => {
  const navigation = useNavigation();

  
  return (
    <>
      <View style={styles.container}>
        <HeaderImageBackground customSize={CUSTOM_HEADER}>
          <HeaderTitle titleOnly showAddress={false} title="Food Orders" />
        </HeaderImageBackground>
        <TransactionTabs />
        <TransactionList
          // data={transactionList}
          // loading={loading}
          // error={error}
          // refreshing={refreshing}
          // onRefresh={onRefresh}
          // loadMore={loadMore}
        />
      </View>
    </>
  );
}

const ToktokFoodOrderTransactions = () => {
  return (
    <VerifyContextProvider>
      <MainComponent />
    </VerifyContextProvider>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  }
});

export default ToktokFoodOrderTransactions;
