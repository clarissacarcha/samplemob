import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image, Platform, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {GET_PRODUCTS_BY_SHOP_CATEGORY} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';

// Fonts & Colors
import {COLOR} from 'res/variables';
import { food1 } from 'toktokfood/assets/images';


import {
  verticalScale,
  getDeviceHeight,
  getStatusbarHeight,
  moderateScale,
  isIphoneXorAbove,
} from 'toktokfood/helper/scale';

const FoodList = (props) => {
  const { activeTab, id, tagsLoading } = props;
  const navigation = useNavigation();

  // data fetching for product under specific category
  const [getProductsByShopCategory, {data: products, error: productsError, loading: productsLoading }] = useLazyQuery(GET_PRODUCTS_BY_SHOP_CATEGORY, {
    variables: {
      input: {
        id: id,
        catId: `${activeTab.id}`
      }
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if(activeTab?.id){
      getProductsByShopCategory()
    }
  }, [activeTab])

  const onNavigateToFoodItemDetails = (item) => {
    navigation.navigate('ToktokFoodItemDetails', item);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => onNavigateToFoodItemDetails(item)} style={styles.listContainer}>
        <View>
          <Text style={styles.listText}>{item.itemname}</Text>
          <Text style={styles.listPrice}>PHP {item.price.toFixed(2)}</Text>
          <Text numberOfLines={1} >{item.summary}</Text>
        </View>
        <View>
          <Image resizeMode="contain" source={food1} style={styles.img} />
        </View>
      </TouchableOpacity>
    );
  };
  
  if(productsLoading || tagsLoading || productsError){
    return <LoadingIndicator style={styles.container} isLoading={true} />
  }
  return(
    <>
      <FlatList
        data={products ? products.getProductsByShopCategory : []}
        extraData={props}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        ListEmptyComponent={() => (
          <View style={styles.container}>
            <Text style={{ textAlign: 'center', marginVertical: 20 }}>No products</Text>
          </View>
        )}
      />
    </>
  )
};

export default FoodList;

const styles = StyleSheet.create({
  container: {
    minHeight:
      Platform.OS === 'ios' && isIphoneXorAbove()
        ? 518
        : getDeviceHeight -
          ((Platform.OS === 'android' ? moderateScale(88 + getStatusbarHeight) : moderateScale(105)) +
            moderateScale(180)),
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  headerBack: {
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  img: {
    height: 55,
    width: 60,
  },
  listText: {
    fontWeight: '500',
    paddingVertical: 3,
  },
  listPrice: {
    color: '#FF6200',
    fontWeight: '500',
    paddingVertical: 3,
  },
  listContainer: {
    borderBottomWidth: 1,
    borderColor: '#E6E6E6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(15),
    paddingHorizontal: verticalScale(20)
  },
});
