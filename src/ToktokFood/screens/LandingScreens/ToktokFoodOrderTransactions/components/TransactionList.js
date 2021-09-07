import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, FlatList, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale, moderateScale} from 'toktokfood/helper/scale';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import { TransactionItems } from './TransactionItems';
// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';

const ListEmptyComponent = () => (
  <Text style={{ color: '#898997', textAlign: 'center', marginVertical: 20 }}>
    No results found
  </Text>
)
export const TransactionList = (props) => {

  const navigation = useNavigation();
  const { data, loading, error, refreshing, onRefresh } = props

  return (
    <View style={styles.listContainer}>
      { (loading || error) ? (
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
          ListEmptyComponent={ListEmptyComponent}
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
});

