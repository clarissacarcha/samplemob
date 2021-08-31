import React, {useState, useEffect, useRef} from 'react';
import {FlatList, Image, Platform, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {GET_CATEGORIES} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import { onErrorAlert } from 'src/util/ErrorUtility';
import {useAlert} from 'src/hooks';

// Assets
import {allcuisines, drinks, dailydeals, fastfood} from 'toktokfood/assets/images';

import {moderateScale, getDeviceWidth, scale} from 'toktokfood/helper/scale';
import { useSelector } from 'react-redux'
import { set } from 'react-native-reanimated';


const CategoryList = ({horizontal, rightText = '', filterSearch = 0}) => {

  const navigation = useNavigation();
  const [tempCategories, setTempCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [loadMore, setLoadMore] = useState(false);
  const [pendingProcess, setPendingProcess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const limit = 10;
  const flatListRef = useRef()
  const {data, error, loading, fetchMore, refetch} = useQuery(GET_CATEGORIES, {
    variables: {
      input: {
        page: 0,
        limit,
        filterSearch: filterSearch ? filterSearch.id : 0
      }
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    onRefresh()
  }, [filterSearch]);

  useEffect(() => {
    if(page != 0 && data && data.getCategories.length > 0){
      setLoadMore(true)
      setTimeout(() => {
        fetchMore({
          variables: {
            input: {
              page: page,
              limit: limit,
              filterSearch: filterSearch ? filterSearch.id : 0
            }
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            return { getCategories: [ ...previousResult.getCategories, ...fetchMoreResult.getCategories ] }
          }
        })
        setLoadMore(false)
      }, 200)
    }
  }, [page]);

  useEffect(() => {
    if(data){
      if(JSON.stringify(data.getCategories) != JSON.stringify(tempCategories)){
        setTempCategories(data.getCategories)
        setPendingProcess(true)
      } else {
        setPendingProcess(false)
      }
    }
  }, [data, page]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(!horizontal);
    setPage(0)
    setTempCategories([])
    refetch()
    if(data){ flatListRef.current.scrollToOffset({ animated: true, offset: 0 }) }
  }, [filterSearch]);

  const onNavigateCategories = () => {
    navigation.navigate('ToktokFoodCategories');
  };

  const handleLoadMore = () => {
    if(!loadMore && pendingProcess){
      setPage((prev) => prev + 1)
    }
  }

  const renderItem = ({item}) => {
    if(horizontal){
      return (
        <TouchableOpacity style={styles.listItemVerticalContainer} onPress={() => { navigation.navigate('ToktokFoodSearch', { search: item.categoryName }) }}>
          <Image style={styles.img} resizeMode="cover" source={fastfood} />
          <Text numberOfLines={1} style={styles.listItemText}>{item.categoryName}</Text>
        </TouchableOpacity>
      )
    }
    return (
      <TouchableOpacity style={{ flexDirection: 'row', paddingBottom: 10 }}>
        <Image style={styles.img} resizeMode="cover" source={fastfood} />
        <Text numberOfLines={1} style={[styles.listItemText, { paddingHorizontal: 10 }]}>{item.categoryName}</Text>
      </TouchableOpacity>
    );
  };

  const displayComponent = () => {
    if((loading && horizontal) || error){
      return <View style={{  }}><ActivityIndicator size='large' /></View>
    }
    return (
      <FlatList
        extraData={loadMore}
        horizontal={horizontal}
        data={data ? data.getCategories : []}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(val, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: horizontal ? 0 : 30 }}
        ListFooterComponent={() => ( loadMore ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size='large' /></View> : null)}
        onEndReachedThreshold={0}
        onEndReached={() => handleLoadMore()}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
          />
        }
        ref={flatListRef}
      />
    )
  }

  return (
    <View style={[ styles.container, { flex: horizontal ? 0 : 1, paddingHorizontal: horizontal ? 14  : 20 } ]}>
      <View style={styles.textContainer}>
        <Text style={styles.startText}>Categories</Text>
        <TouchableOpacity onPress={() => onNavigateCategories()}>
          <Text style={styles.endText}>{rightText}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        { displayComponent() }
      </View>
    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: Platform.OS === 'android' ? 1 : 0,
  },
  img: {
    borderRadius: 10,
    width: scale(75),
  },
  listContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  listItemContainer: {
    marginHorizontal: 5,
  },
  listItemVerticalContainer: {
    marginHorizontal: 5,
    width: (getDeviceWidth - scale(60)) / 4 - 1
  },
  listItemText: {
    fontSize: 13,
    marginTop: 5,
    fontWeight: '500',
    textAlign: 'center',
    flexWrap: 'wrap'
  },
  endText: {
    fontSize: 15,
    color: '#FFA700',
    fontWeight: '400',
  },
  startText: {
    fontSize: 15,
    fontWeight: '500',
  },
  textContainer: {
    flexDirection: 'row',
    marginVertical: moderateScale(8),
    justifyContent: 'space-between',
  },
});
