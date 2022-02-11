import React, {useEffect, useState, useContext} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image, Platform, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useLazyQuery} from '@apollo/react-hooks';
import {GET_PRODUCTS_BY_SHOP_CATEGORY, GET_SEARCH_PRODUCTS_BY_SHOP} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {VerifyContext} from '../components';
// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';
import ContentLoader from 'react-native-easy-content-loader';

import {
  verticalScale,
  getDeviceHeight,
  getStatusbarHeight,
  moderateScale,
  isIphoneXorAbove,
  getIphoneNotchSize,
} from 'toktokfood/helper/scale';

export const FoodList = props => {
  const {activeTab, id, tagsLoading} = props;
  const navigation = useNavigation();
  const {searchProduct, setSearchProduct, temporaryCart, foodCartHeight, navBartHeight} = useContext(VerifyContext);
  const navBar = Platform.OS == 'ios' ? navBartHeight + getIphoneNotchSize * 2 : navBartHeight;
  const minHeight = getDeviceHeight - navBar - foodCartHeight;

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
  const [getSearchProductsByShop, {data: searchProducts, error: searchProductsError, loading: searchProductsLoading}] =
    useLazyQuery(GET_SEARCH_PRODUCTS_BY_SHOP, {
      client: TOKTOK_FOOD_GRAPHQL_CLIENT,
      fetchPolicy: 'network-only',
    });

  useEffect(() => {
    if (activeTab?.id) {
      setSearchProduct('');
      getProductsByShopCategory();
    }
  }, [activeTab]);

  useEffect(() => {
    if (searchProduct) {
      getSearchProductsByShop({
        variables: {
          input: {
            id: id,
            key: searchProduct,
          },
        },
      });
    }
  }, [searchProduct]);

  const onNavigateToFoodItemDetails = Id => {
    navigation.navigate('ToktokFoodItemDetails', {Id, temporaryCart: temporaryCart.items});
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => onNavigateToFoodItemDetails(item.Id)}
        style={[
          styles.listContainer,
          {
            paddingBottom: index == 0 ? moderateScale(10) : 0,
            marginVertical: index == 0 ? 0 : moderateScale(10),
          },
        ]}>
        <View style={{flex: 1}}>
          <Text style={styles.listText}>{item.itemname}</Text>
          <Text style={styles.listPrice}>PHP {item.price.toFixed(2)}</Text>
          {!!item.summary && (
            <Text numberOfLines={1} style={styles.summary}>
              {item.summary}
            </Text>
          )}
        </View>
        <View>
          <Image resizeMode="cover" source={{uri: item.filename}} style={styles.img} />
        </View>
      </TouchableOpacity>
    );
  };
  if (productsLoading || tagsLoading || productsError || searchProductsLoading) {
    let listSize = (getDeviceHeight / verticalScale(100)).toFixed(0);

    return (
      <View style={{paddingHorizontal: moderateScale(10), paddingTop: moderateScale(10)}}>
        <ContentLoader
          active
          pRows={3}
          pWidth={['50%', '30%', '70%']}
          title={false}
          primaryColor="#FFFFFF"
          secondaryColor="rgba(256,186,28,0.4)"
          aShape="square"
          aSize="large"
          listSize={parseInt(listSize)}
          avatar
          reverse
        />
      </View>
    );
  }

  const itemSepartor = () => <View style={styles.separtor} />;

  const ItemList = () => {
    const dataSet = searchProduct
      ? searchProducts?.getSearchProductsByShop
      : products
      ? products.getProductsByShopCategory
      : [];

    return dataSet.map((v, i) => renderItem(v, i));
  };

  return (
    <>
      {/* <ItemList /> */}
      <FlatList
        data={searchProduct ? searchProducts?.getSearchProductsByShop : products ? products.getProductsByShopCategory : []}
        extraData={props}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.container,
          { minHeight }
        ]}
        ItemSeparatorComponent={itemSepartor}
        ListEmptyComponent={() => (
          <Text style={{textAlign: 'center', marginVertical: 20}}>
            { searchProduct ? 'No product found' : 'This restaurant has no products yet.' }
          </Text>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  headerBack: {
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  img: {
    height: moderateScale(70),
    width: moderateScale(70),
    borderRadius: 5,
  },
  listText: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
  },
  summary: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    flexShrink: 1,
    paddingRight: 10,
  },
  listPrice: {
    color: '#FF6200',
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    paddingVertical: 3,
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: verticalScale(18),
    alignItems: 'center',
  },
  separtor: {
    borderBottomWidth: 1,
    borderColor: '#E6E6E6',
    marginHorizontal: verticalScale(20),
  },
});
