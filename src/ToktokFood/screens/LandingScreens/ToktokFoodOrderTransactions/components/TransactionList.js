import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, FlatList, RefreshControl, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import { TransactionItems } from './TransactionItems';
// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';
// Utils
import {getStatusbarHeight, scale, moderateScale, verticalScale} from 'toktokfood/helper/scale';
import {empty_orders} from 'toktokfood/assets/images';

const renderEmpty = () => (
  <View style={styles.emptyContainer}>
    <Image style={styles.emptyImg} resizeMode="contain" source={empty_orders} />
    <Text style={styles.emptyText}>No notifications</Text>
  </View>
);
export const TransactionList = (props) => {

  const navigation = useNavigation();
  const { data, loading, error, refreshing, onRefresh } = props

  return (
    <View style={styles.listContainer}>
      { ((loading || error) || data == null) ? (
        <LoadingIndicator isFlex isLoading={true} />
      ) : (
        <FlatList
          data={data} // data ? data.getTransactions : []
          renderItem={({ item, index }) => 
            <TransactionItems
              item={item}
              index={index}
              data={data}
            />
          }
          ListEmptyComponent={renderEmpty}
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
    paddingVertical: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    paddingTop: verticalScale(80),
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

