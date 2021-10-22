import React, {useState, useEffect, useRef} from 'react';
import {FlatList, Image, Platform, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {GET_CATEGORIES_BY_LIMIT} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import { onErrorAlert } from 'src/util/ErrorUtility';
import {useAlert} from 'src/hooks';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';

// Assets
import {allcuisines, drinks, dailydeals, fastfood} from 'toktokfood/assets/images';
// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';

import {moderateScale, getDeviceWidth, scale, verticalScale, getDeviceHeight} from 'toktokfood/helper/scale';
import { useSelector } from 'react-redux'


const CategoryList = ({horizontal, rightText = '', filterSearch = 0, homeRefreshing}) => {

  const navigation = useNavigation();
  const [tempCategories, setTempCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [loadMore, setLoadMore] = useState(false);
  const [pendingProcess, setPendingProcess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const limit = 10;
  const flatListRef = useRef()

  // fetch data in categoties
  const {data, error, loading, fetchMore, refetch} = useQuery(GET_CATEGORIES_BY_LIMIT, {
    variables: {
      input: {
        page: 0,
        limit: limit,
        filterSearch: filterSearch ? filterSearch.id : 0
      }
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    onRefresh()
  }, [filterSearch, homeRefreshing]);

  useEffect(() => {
    if(page != 0 && data && data.getCategoriesByLimit.length > 0){
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
          return { getCategoriesByLimit: [ ...previousResult.getCategoriesByLimit, ...fetchMoreResult.getCategoriesByLimit ] }
        }
      })
    }
  }, [page]);

  useEffect(() => {
    if(data){
      if(JSON.stringify(data.getCategoriesByLimit) != JSON.stringify(tempCategories)){
        setTempCategories(data.getCategoriesByLimit)
        setPendingProcess(true)
      } else {
        setPendingProcess(false)
      }
      setTimeout(() => {
        setLoadMore(false)
      }, 2000)
    }
  }, [data, page]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(page !== 0);
    setPage(0)
    setTempCategories([])
    refetch()
    if(data?.length > 0){ 
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
    }
  }, [filterSearch]);

  const onNavigateCategories = () => {
    navigation.navigate('ToktokFoodCategories');
  };

  const handleLoadMore = () => {
    if(!loadMore && pendingProcess){
      setPage((prev) => prev + 1)
      setLoadMore(true)
    }
  }

  const showSearchPage = (item) => {
    navigation.navigate('ToktokFoodSearch', { searchByCategory: item.categoryName, isSearchPage: true }) 
  }

 
  const renderItem = ({item}) => {
    let image = item.filename ? { uri: item.filename } : fastfood
    return (
      <TouchableOpacity
        style={horizontal ? styles.listItemVerticalContainer : { flexDirection: 'row', paddingBottom: 10 }}
        onPress={() => showSearchPage(item)}
      >
        <Image style={styles.img} resizeMode="cover" source={image} />
        <Text numberOfLines={1} style={[styles.listItemText, { paddingHorizontal: horizontal ? 0 : 10 }]}>{item.categoryName}</Text>
      </TouchableOpacity>
    );
  };


  const listEmpty = () => (
    <Text style={{  color: '#898997', textAlign: 'center', marginVertical: 20 }}>
      No result found
    </Text>
  )
  
  const displayComponent = () => {
    const datas = horizontal ? data?.getCategoriesByLimit.slice(0, 4) : data?.getCategoriesByLimit
    const shops = datas ? datas : []
 
    if(loading || error){
      return <LoadingIndicator style={{ marginVertical: 20  }} isLoading={true} />
    }
    return (
      <FlatList
        extraData={loadMore}
        horizontal={data?.getCategoriesByLimit.length > 0 ? horizontal : false}
        data={shops} 
        renderItem={renderItem}
        scrollEnabled={!horizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(val, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: horizontal ? 0 : verticalScale(10) }}
        onEndReachedThreshold={0.2}
        onEndReached={() => handleLoadMore()}
        refreshControl={
          !horizontal ? 
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={['#FFA700']}
            tintColor='#FFA700'
          /> : null
        }
        ref={flatListRef}
        ListFooterComponent={() => ( <LoadingIndicator isFlex isLoading={loadMore} /> )}
        ListEmptyComponent={listEmpty()}
      />
    )
  }

  return (
    <View style={[ styles.container ]}>
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
    flex: 1,
    paddingHorizontal: scale(16),
    backgroundColor: 'white'
  },
  img: {
    borderRadius: 10,
    width: scale(75),
    height: scale(55),
  },
  listContainer: {
    marginVertical: 10
  },
  listItemContainer: {
    marginHorizontal: 5,
  },
  listItemVerticalContainer: {
    marginRight: scale(11),
    width: (getDeviceWidth - scale(60)) / 4 - 1
  },
  listItemText: {
    fontSize: FONT_SIZE.M,
    marginTop: 5,
    textAlign: 'center',
    flexWrap: 'wrap',
    fontFamily: FONT.BOLD
  },
  endText: {
    fontSize: 15,
    color: '#FFA700',
    fontWeight: '400',
  },
  startText: {
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD
  },
  textContainer: {
    flexDirection: 'row',
    marginVertical: moderateScale(0),
    justifyContent: 'space-between',
  },
});
