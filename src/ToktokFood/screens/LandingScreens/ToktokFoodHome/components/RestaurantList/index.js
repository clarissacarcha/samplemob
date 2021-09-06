import React, { useState, useEffect, useRef } from 'react';
import {FlatList, Image, View, StyleSheet, Text, TouchableOpacity, Platform, RefreshControl, ActivityIndicator} from 'react-native';
import {Rating} from 'react-native-ratings';
import {useNavigation} from '@react-navigation/native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import {GET_SHOPS} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';

// Utils
import {scale, verticalScale, getDeviceHeight} from 'toktokfood/helper/scale';
import {restaurants} from 'toktokfood/helper/strings';
import RestaurantItem from './RestaurantItem';

const RestaurantList = (props) => {

  const { loading, error, data, loadMore, location } = props;

  const renderFooter = () => (
    <LoadingIndicator style={{}} isLoading={loadMore} />
  )

  const listEmpty = () => (
    <Text style={{ color: '#898997', textAlign: 'center', marginVertical: 20 }}>
      No shops near you as of the moment
    </Text>
  )
 
  if(loading || error || location == undefined){
    return <LoadingIndicator style={{ marginVertical: 20  }} isFlex isLoading={true} />
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={data ? data.getShops : []}
        extraData={loadMore}
        numColumns={2}
        renderItem={({ item }) => ( <RestaurantItem item={item} /> )}
        // columnWrapperStyle={styles.columnStyle}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(val, index) => index.toString()}
        ListFooterComponent={renderFooter()}
        ListEmptyComponent={listEmpty()}
        contentContainerStyle={{ paddingBottom: Platform.OS == 'android' ? verticalScale(20) : 0  }}
      />
    </View>
  );
};

export default RestaurantList;

const styles = StyleSheet.create({
  branchInfo: {
    flexDirection: 'row',
  },
  branches: {
    fontWeight: '400',
    paddingHorizontal: 3,
    fontSize: Platform.OS === 'android' ? 9 : 10,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  columnStyle: {
    justifyContent: 'space-between',
  },
  img: {
    height: 150,
    alignSelf: 'center',
    width: Platform.OS === 'android' ? 153 : scale(150),
  },
  listContainer: {
    flex: 1,
    alignItems: 'center',
    // marginTop: Platform.OS === 'android' ? 0 : 10,
  },
  ratings: {
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  restaurantInfo: {
    paddingVertical: 10,
    paddingHorizontal: 13,
  },
  restaurantList: {
    // alignItems: 'center',
    width: '50%',
  },
  restaurantName: {
    fontSize: 12,
    fontWeight: '500',
  },
});
