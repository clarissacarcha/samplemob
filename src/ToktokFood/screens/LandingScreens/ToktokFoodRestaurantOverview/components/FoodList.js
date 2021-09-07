import React, {useEffect, useState, useContext} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image, Platform, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {GET_PRODUCTS_BY_SHOP_CATEGORY, GET_PRODUCTS_BY_SHOP} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import {VerifyContext} from '../components';
// Fonts & Colors
import {COLOR} from 'res/variables';
import {food1} from 'toktokfood/assets/images';

import {
  verticalScale,
  getDeviceHeight,
  getStatusbarHeight,
  moderateScale,
  isIphoneXorAbove,
} from 'toktokfood/helper/scale';

export const FoodList = (props) => {
  const {activeTab, id, tagsLoading, ratings} = props;
  const navigation = useNavigation();
  const {searchProduct, setSearchProduct} = useContext(VerifyContext);

  // data fetching for product under specific category
  const [getProductsByShopCategory, {data: products, error: productsError, loading: productsLoading}] = useLazyQuery(
    GET_PRODUCTS_BY_SHOP_CATEGORY,
    {
      variables: {
        input: {
          id: id,
          catId: activeTab?.id,
          // key: searchProduct,
        },
      },
      client: TOKTOK_FOOD_GRAPHQL_CLIENT,
      fetchPolicy: 'network-only',
    },
  );

  // data fetching for product 
  const [getProductsByShop, {data: searchProducts, error: searchProductsError, loading: searchProductsLoading}] = useLazyQuery(
    GET_PRODUCTS_BY_SHOP,
    {
      client: TOKTOK_FOOD_GRAPHQL_CLIENT,
      fetchPolicy: 'network-only',
    },
  );

  useEffect(() => {
    if (activeTab?.id) {
      setSearchProduct('');
      getProductsByShopCategory();
    }
  }, [activeTab]);

  useEffect(() => {
    if(searchProduct){
      getProductsByShop({
        variables: {
          input: {
            id: id,
            key: searchProduct,
          },
        },
      })
    }
  }, [searchProduct])

  const onNavigateToFoodItemDetails = (item) => {
    navigation.navigate('ToktokFoodItemDetails', {...item, ...{ratings}});
  };
 
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => onNavigateToFoodItemDetails(item)} style={styles.listContainer}>
        <View>
          <Text style={styles.listText}>{item.itemname}</Text>
          <Text style={styles.listPrice}>PHP {item.price.toFixed(2)}</Text>
          <Text numberOfLines={1}>{item.summary}</Text>
        </View>
        <View>
          <Image resizeMode="contain" source={{uri: item.filename}} style={styles.img} />
        </View>
      </TouchableOpacity>
    );
  };

  if (productsLoading || tagsLoading || productsError || searchProductsLoading) {
    return <LoadingIndicator style={[styles.container, {paddingVertical: 20}]} isLoading={true} />;
  }
  return (
    <>
      <FlatList
        data={searchProduct ? searchProducts?.getProductsByShop : products ? products.getProductsByShopCategory : []}
        extraData={props}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        ListEmptyComponent={() => (
          <View style={styles.container}>
            <Text style={{textAlign: 'center', marginVertical: 20}}>No products</Text>
          </View>
        )}
      />
    </>
  );
};

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
    paddingHorizontal: verticalScale(20),
  },
});
