/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation, useRoute} from '@react-navigation/native';
import {FlatList, Image, RefreshControl, View, Text, TouchableOpacity} from 'react-native';
import {useQuery} from '@apollo/react-hooks';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash';

import styles from './styles';

// import {VectorIcon, ICON_SET} from 'src/revamp';
// import {COLORS} from 'src/res/constants';
// import {COLOR, FONT, FONT_SIZE} from 'res/variables';

// Components
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import YellowButton from 'toktokfood/components/YellowButton';

// Strings
// import {notifications} from 'toktokfood/helper/strings';
import {fastfood, new_empty_shop_icon, time} from 'toktokfood/assets/images';

// Queries
import {GET_SHOP_BY_CATEGORY} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';

const ToktokFoodShopCategories = () => {
  const {customerInfo, location} = useSelector(state => state.toktokFood);
  const isFocus = useIsFocused();
  const navigation = useNavigation();
  const route = useRoute();
  // State
  // const [refreshing, setRefreshing] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [hasMorePage, setHasMorePage] = useState(true);
  const [page, setPage] = useState(0);

  const {category} = route.params;
  const variablesInput = {
    userLongitude: location?.longitude,
    userLatitude: location?.latitude,
    page: 0,
    category: {
      id: category?.id,
      categoryName: category?.categoryName,
    },
  };

  console.log(JSON.stringify(variablesInput))

  // fetch data in categoties
  const {data, error, loading, fetchMore, refetch} = useQuery(GET_SHOP_BY_CATEGORY, {
    variables: {
      input: variablesInput,
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (isFocus && !loading) {
      setHasMorePage(true);
      setPage(0);
      refetch();
    }
  }, [isFocus]);

  const onLoadMore = () => {
    if (!loadMore && hasMorePage) {
      setLoadMore(true);

      fetchMore({
        variables: {
          input: {
            ...variablesInput,
            page: page + 1,
          },
        },
        updateQuery: (previousResult, {fetchMoreResult}) => {
          setPage(prev => prev + 1);
          setLoadMore(false);
          if (!fetchMoreResult) {
            return previousResult;
          }
          if (!fetchMoreResult?.getShopByCategory.length) {
            setHasMorePage(false);
          }
          const mergeData = _.unionBy(
            previousResult.getShopByCategory,
            fetchMoreResult.getShopByCategory,
            'id',
          );
          return {
            getShopByCategory: mergeData,
          };
        },
      });
    }
  };

  const onShopNavigate = item => {
    navigation.navigate('ToktokFoodShopOverview', {item});
  };

  const onSetLocationDetails = () => {
    navigation.navigate('ToktokFoodAddressDetails');
  };
  const renderStatusTag = ({hasOpen, hasProduct}) => {
    if (hasOpen && hasProduct) {
      return null;
    }
    if (!hasProduct) {
      return (
        <View style={styles.closedTag}>
          <Text style={styles.closedText}>Currently Unavailable</Text>
        </View>
      );
    }
    return (
      <View style={styles.closedTag}>
        <Text style={styles.closedText}>Currently Closed</Text>
      </View>
    );
  };

  const renderItem = ({item}) => {
    const image = item.logo ? {uri: item.logo} : fastfood;
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => onShopNavigate(item)}>
        {/* <Image style={styles.img} resizeMode="cover" source={image} /> */}
        <FastImage source={image} resizeMode={FastImage.resizeMode.cover} style={styles.img} />

        <View>
          <Text numberOfLines={1} style={styles.shopName}>
            {item.shopname}
          </Text>

          <View style={styles.shopDetails}>
            <Image resizeMode="contain" source={time} style={styles.timeImg} />
            <Text style={styles.subInfoText}>{item.estimatedDeliveryTime} mins</Text>
            <MCIcon name="map" color="#FDBA1C" size={15} />
            <Text style={styles.subInfoText}>{item.estimatedDistance} KM</Text>
          </View>

          {renderStatusTag(item)}

          {/* {!item.hasOpen && (
            <View style={styles.closedTag}>
              <Text style={styles.closedText}>Currently Closed</Text>
            </View>
          )} */}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <LoadingIndicator style={styles.loaderStyle} isFlex isLoading={true} />
        </View>
      );
    }
    return (
      <View style={[styles.emptyContainer]}>
        <Image resizeMode="cover" style={styles.emptyShop} source={new_empty_shop_icon} />
        <Text style={styles.emptyTextTitle}>No Restaurant Available</Text>
        <Text style={styles.emptyText}>
          It seems like there is no open restaurant{'\n'}near you. Refresh or try again later.
        </Text>

        <View style={styles.btnContainer}>
          <YellowButton onPress={onSetLocationDetails} label="Try other location" btnStyle={styles.btnStyle} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FIcon5 color="#F6841F" name="chevron-left" size={15} />
        </TouchableOpacity>
        <Text style={styles.headerLabel}>{category?.categoryName}</Text>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={data?.getShopByCategory}
          renderItem={renderItem}
          //   refreshControl={
          //     <RefreshControl
          //       colors={['#FFA700']}
          //       tintColor={COLORS.ORANGE}
          //       //   refreshing={refreshing}
          //       //   onRefresh={onRefresh}
          //     />
          //   }
          onEndReachedThreshold={0.2}
          onEndReached={() => onLoadMore()}
          ListFooterComponent={() => <LoadingIndicator isFlex isLoading={loadMore} />}
          ListEmptyComponent={renderEmpty}
        />
      </View>
    </View>
  );
};

export default ToktokFoodShopCategories;
