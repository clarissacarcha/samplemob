import { useLazyQuery } from '@apollo/react-hooks';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, RefreshControl, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { TOKTOK_FOOD_GRAPHQL_CLIENT } from 'src/graphql';
import HeaderTabs from 'toktokfood/components/HeaderTabs';
import { GET_SHOPS } from 'toktokfood/graphql/toktokfood';
// Utils
import { moderateScale, verticalScale } from 'toktokfood/helper/scale';
// Components
import { AdvertisementSection, CategoryList, RestaurantList } from './index';



// const {height: SCREEN_HEIGHT} = Dimensions.get('window');
// const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
// const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
// const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 0) : 64;
// const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;

const tabs = [
  {
    id: 1,
    name: 'Near You',
  },
  // {
  //   id: 2,
  //   name: 'Promos',
  // },
  // {
  //   id: 3,
  //   name: 'All',
  // },
];

const StickyView = () => {

  const [offset, setOffset] = useState(0);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const headerMaxHeight = Platform.OS === 'ios' ? moderateScale(295) : moderateScale(325);
  const headerMinHeight = Platform.OS === 'ios' ? verticalScale(50) : moderateScale(65);
  const { location } = useSelector((state) => state.toktokFood);

  const RenderNavBar = () => {
    return (
      <View style={[styles.headerWrapper, styles.navbarWrapper]}>
        <HeaderTabs activeTab={activeTab} tabs={tabs} setActiveTab={setActiveTab} />
      </View>
    );
  };

  const RenderTitle = () => (
    <>
      <View style={styles.adsContainer}>
        <AdvertisementSection />
      </View>
      <CategoryList horizontal={true} rightText="See all" />
      <RenderNavBar />
    </>
  );

  const navigation = useNavigation();
  const [tempCategories, setTempCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [loadMore, setLoadMore] = useState(false);
  const [pendingProcess, setPendingProcess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  let variableInput = {
    limit: 10,
    radius: 5,
    userLongitude: location?.longitude,
    userLatitude: location?.latitude 
  }
  const scrollRef = useRef()

  // data fetching for shops
  const [getShops, {data, error, loading, fetchMore, refetch}] = useLazyQuery(GET_SHOPS, {
    variables: {
      input: {
        page: 0,
        ...variableInput
      }
    },
    onError: () => {
      setRefreshing(false)
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if(location !== undefined){
      getShops()
    }
  }, [location]);

  useEffect(() => {
    if(page != 0 && data && data.getShops.length > 0){
        fetchMore({
          variables: {
            input: {
              page: page,
              ...variableInput
            }
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            return { getShops: [ ...previousResult.getShops, ...fetchMoreResult.getShops ] }
          }
        })
    }
  }, [page]);

  useEffect(() => {
    if(data){
      if(JSON.stringify(data.getShops) != JSON.stringify(tempCategories)){
        setTempCategories(data.getShops)
        setPendingProcess(true)
        setLoadMore(false)
      } else {
        setPendingProcess(false)
        setTimeout(() => { 
          setLoadMore(false)
        }, 2000)
      }
      setRefreshing(false)
    }
  }, [data, page]);

  const onNavigateCategories = () => {
    navigation.navigate('ToktokFoodCategories');
  };

  const handleLoadMore = (nativeEvent) => {
    if(!loadMore && pendingProcess){
      setPage((prev) => prev + 1)
      setLoadMore(isCloseToBottom(nativeEvent))
    }
  }

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 120;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  const onRefresh = () => {
    setRefreshing(true)
    setPage(0)
    setTempCategories([])
    refetch().then(() => {
      setRefreshing(false)
    })
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      {/* <ReactNativeParallaxHeader
        alwaysShowNavBar={false}
        alwaysShowTitle={false}
        headerMinHeight={headerMinHeight}
        headerMaxHeight={headerMaxHeight}
        headerTitleStyle={{zIndex: offset <= 50 ? 1 : -1}}
        extraScrollHeight={10}
        title={<RenderTitle />}
        backgroundColor="transparent"
        navbarColor="whitesmoke"
        renderContent={() => <RestaurantList location={location} loading={loading} error={error} data={data} loadMore={loadMore} />}
        renderNavBar={() => <RenderNavBar />}
        containerStyle={styles.container}
        contentContainerStyle={styles.contentContainer}
        scrollEventThrottle={400}
        scrollViewProps={{
          // onScroll: (event) => setOffset(event.nativeEvent.contentOffset.y),
          onScroll: ({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              handleLoadMore(nativeEvent)
            }
          },
          refreshControl: (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          )
          // onScrollEndDrag: ({ nativeEvent }) => setOffset(nativeEvent.contentOffset.y - 100),
          // onMomentumScrollEnd: ({ nativeEvent }) => {
          //   // setOffset(nativeEvent.contentOffset.y - 100)
          //   console.log(isCloseToBottom(nativeEvent), 'asdasd')
          //   if (isCloseToBottom(nativeEvent)) {
          //     handleLoadMore(nativeEvent)
          //   }
          // }
        }}
      /> */}
      <ScrollView
        stickyHeaderIndices={[2]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FFA700']}
            tintColor='#FFA700'
          />
        }
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            handleLoadMore(nativeEvent)
          }
        }}
        scrollEventThrottle={15}
        
      >
        {/* <View style={styles.adsContainer}>
          <AdvertisementSection />
        </View> */}
        <CategoryList
          horizontal
          homeRefreshing={refreshing}
          rightText="See all"
        />
        <RenderNavBar />
        <RestaurantList
          location={location}
          loading={loading}
          error={error}
          data={data}
          loadMore={loadMore}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  contentContainer: {
    backgroundColor: 'whitesmoke',
    paddingBottom: Platform.OS === 'android' ? 10 : 30,
    marginTop: Platform.OS === 'ios' ? moderateScale(20) : moderateScale(14)
  },
  headerWrapper: {paddingHorizontal: 15, width: '100%', paddingTop: moderateScale(8), backgroundColor: 'whitesmoke'},
  navbarWrapper: {
    // marginBottom: Platform.OS === 'ios' ? verticalScale(12) : verticalScale(8),
  },
  adsContainer: {
    height: 130,
    width: '100%',
  },
});

export default StickyView;
