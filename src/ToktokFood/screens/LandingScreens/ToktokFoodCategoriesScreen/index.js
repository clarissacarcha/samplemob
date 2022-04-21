/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {FlatList, Image, RefreshControl, View, Text, TouchableOpacity} from 'react-native';
import {useQuery} from '@apollo/react-hooks';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import styles from './styles';

import {VectorIcon, ICON_SET} from 'src/revamp';
import {COLORS} from 'src/res/constants';

// Components
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';

// Strings
// import {notifications} from 'toktokfood/helper/strings';
import {fastfood} from 'toktokfood/assets/images';

// Queries
import {GET_CATEGORIES_BY_LIMIT} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';

const ToktokFoodCategoriesScreen = () => {
  const {customerInfo} = useSelector(state => state.toktokFood);
  const isFocus = useIsFocused();
  const navigation = useNavigation();
  // State
  const [refreshing, setRefreshing] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [page, setPage] = useState(0);

  // fetch data in categoties
  const {data, error, loading, fetchMore, refetch} = useQuery(GET_CATEGORIES_BY_LIMIT, {
    variables: {
      input: {
        page: 0,
        limit: 10,
        filterSearch: 0,
      },
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
  });

  const onLoadMore = () => {
    if (!loadMore) {
      setLoadMore(true);

      fetchMore({
        variables: {
          input: {
            page: page + 1,
            limit: 10,
            filterSearch: 0,
          },
        },
        updateQuery: (previousResult, {fetchMoreResult}) => {
          setPage(prev => prev + 1);
          setLoadMore(false);

          if (!fetchMoreResult) {
            return previousResult;
          }
          return {
            getCategoriesByLimit: [...previousResult.getCategoriesByLimit, ...fetchMoreResult.getCategoriesByLimit],
          };
        },
      });
    }
  };

  const renderItem = ({item}) => {
    const image = item.filename ? {uri: item.filename} : fastfood;
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => navigation.navigate('ToktokFoodShopCategories', {category: item})}>
        <Image style={styles.img} resizeMode="cover" source={image} />
        <Text numberOfLines={1}>{item.categoryName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FIcon5 color="#F6841F" name="chevron-left" size={15} />
        </TouchableOpacity>
        <Text style={styles.headerLabel}>Categories</Text>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={data?.getCategoriesByLimit}
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
          //   ListEmptyComponent={renderEmpty}
        />
      </View>
    </View>
  );
};

export default ToktokFoodCategoriesScreen;
