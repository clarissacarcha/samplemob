import React, { useState, useEffect, useRef } from 'react';
import {FlatList, Image, View, StyleSheet, Text, TouchableOpacity, Platform, RefreshControl, ActivityIndicator} from 'react-native';
import {Rating} from 'react-native-ratings';
import {useNavigation} from '@react-navigation/native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import {GET_SHOPS} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {scale} from 'toktokfood/helper/scale';
import {allcuisines} from 'toktokfood/assets/images';
import CustomStarRating from 'toktokfood/components/CustomStarRating';

const RestaurantItem = ({ item }) => {

  const navigation = useNavigation();

  const onRestaurantNavigate = (item) => {
    navigation.navigate('ToktokFoodRestaurantOverview', {item});
  };
  
  return (
    <TouchableOpacity onPress={() => onRestaurantNavigate(item)} style={styles.restaurantList}>
      <Image style={styles.img} source={allcuisines} resizeMode="cover" />
      <View style={styles.restaurantInfo}>
        <Text numberOfLines={2} style={styles.restaurantName}>{`${item.shopname} (${item.address})`}</Text>
        <CustomStarRating
          rating={item.ratings ?? '0'}
          starImgStyle={{ width: scale(15), height: scale(15), marginVertical: 5 }}
          readOnly
        />
        <View style={styles.branchInfo}>
          <MCIcon name="clock-outline" color={'#868686'} size={13} />
          <Text style={styles.branches}>{item.estimatedDeliveryTime}</Text>

          <MCIcon name="map-marker-outline" color={'#868686'} size={13} />
          <Text style={styles.branches}>{item.estimatedDistance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    branchInfo: {
      flexDirection: 'row',
    },
    branches: {
      fontWeight: '400',
      paddingHorizontal: 3,
      fontSize: Platform.OS === 'android' ? 9 : 10,
    },
    img: {
      height: 150,
      alignSelf: 'center',
      width: Platform.OS === 'android' ? 153 : scale(150),
      borderRadius: 10,
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
      width: '50%',
    },
    restaurantName: {
      fontSize: 12,
      fontWeight: '500',
    },
  });
  
export default RestaurantItem;
