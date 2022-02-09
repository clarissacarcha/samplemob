/* eslint-disable react-hooks/exhaustive-deps */
import {useLazyQuery} from '@apollo/react-hooks';
import React, {useEffect, useState} from 'react';
import {Platform, RefreshControl, StyleSheet, View, SectionList, Text, Image} from 'react-native';
import {useSelector} from 'react-redux';

// GraphQL & Queries
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_SHOPS} from 'toktokfood/graphql/toktokfood';

// Components
import {CategoryList, ModalKycStatus, RestaurantList} from './index';
import ChangeAddress from 'toktokfood/components/ChangeAddress';
import HeaderTabs from 'toktokfood/components/HeaderTabs';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';

// Assets
import {FONT_SIZE} from 'res/variables';
import {empty_promos, new_empty_shop_icon} from 'toktokfood/assets/images';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';

const tabs = [
  {
    id: 1,
    name: 'Near You',
  },
  {
    id: 2,
    name: 'Promos',
  },
  // {
  //   id: 3,
  //   name: 'All',
  // },
];

const StickyView = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const {location} = useSelector(state => state.toktokFood);

  const RenderNavBar = () => {
    return (
      <View style={[styles.headerWrapper, styles.navbarWrapper]}>
        <HeaderTabs activeTab={activeTab} tabs={tabs} setActiveTab={setActiveTab} />
      </View>
    );
  };

  // const RenderTitle = () => (
  //   <>
  //     <View style={styles.adsContainer}>
  //       <AdvertisementSection />
  //     </View>
  //     <CategoryList horizontal={true} rightText="See all" />
  //     <RenderNavBar />
  //   </>
  // );

  // const navigation = useNavigation();
  const [tempCategories, setTempCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [loadMore, setLoadMore] = useState(false);
  const [pendingProcess, setPendingProcess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const variableInput = {
    limit: 11,
    radius: 3,
    userLongitude: location?.longitude,
    userLatitude: location?.latitude,
    tabId: activeTab.id,
  };

  // data fetching for shops
  const [getShops, {data, error, loading, fetchMore, refetch}] = useLazyQuery(GET_SHOPS, {
    onError: () => {
      setRefreshing(false);
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
  });

  const sample = [
    {type: 'ADDRESS', data: []}, // Static sections.
    {type: 'CATEGORIES', data: []},
    {type: 'RESTAURANTS', data: data && data?.getShops.length > 0 ? data.getShops : [{index: 1}]},
  ];

  // Commented for optimization
  // useEffect(() => {
  //   if (location) {
  //     getShops({
  //       variables: {
  //         input: {
  //           page: 0,
  //           limit: 20,
  //           radius: 3,
  //           userLongitude: location?.longitude,
  //           userLatitude: location?.latitude,
  //           tabId: activeTab.id,
  //         },
  //       },
  //     });
  //   }
  // }, [location, activeTab]);

  useEffect(() => {
    if (location) {
      getShops({
        variables: {
          input: {
            page: 0,
            ...variableInput,
          },
        },
      });
    }
  }, [location, activeTab]);

  useEffect(() => {
    if (page != 0 && data && data.getShops.length > 0) {
      fetchMore({
        variables: {
          input: {
            page: page,
            ...variableInput,
          },
        },
        updateQuery: (previousResult, {fetchMoreResult}) => {
          if (!fetchMoreResult) {
            return previousResult;
          }
          return {getShops: [...previousResult.getShops, ...fetchMoreResult.getShops]};
        },
      });
    }
  }, [page]);

  useEffect(() => {
    if (data) {
      if (JSON.stringify(data.getShops) != JSON.stringify(tempCategories)) {
        setTempCategories(data.getShops);
        setPendingProcess(true);
        setLoadMore(false);
      } else {
        setPendingProcess(false);
        setTimeout(() => {
          setLoadMore(false);
        }, 2000);
      }
      setRefreshing(false);
    }
  }, [data, page]);

  // const onNavigateCategories = () => {
  //   navigation.navigate('ToktokFoodCategories');
  // };

  const handleLoadMore = nativeEvent => {
    if (!loadMore && pendingProcess) {
      setPage(prev => prev + 1);
      setLoadMore(isCloseToBottom(nativeEvent));
    }
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 120;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(0);
    setTempCategories([]);
    refetch({
      variables: {
        input: {
          page: 0,
          ...variableInput,
        },
      },
    }).then(() => {
      setRefreshing(false);
    });
  };

  const EmptyList = () => {
    if (activeTab.id === 1) {
      return (
        <View style={styles.emptyContainer}>
          <Image style={styles.emptyImg} resizeMode="contain" source={new_empty_shop_icon} />
          <Text style={styles.emptyTextTitle}>No Restaurant Available</Text>
          <Text style={styles.emptyText}>
            It seems like there is no open restaurant{'\n'}near you. Refresh or try again later.
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Image style={styles.emptyImg} resizeMode="contain" source={empty_promos} />
        <Text style={styles.emptyTextTitle}>No Promos Available</Text>
        <Text style={styles.emptyText}>There are no restaurants with promos{'\n'}available as of the moment.</Text>
      </View>
    );
  };

  return (
    <>
      <SectionList
        sections={sample}
        keyExtractor={(item, index) => item + index}
        stickyHeaderIndices={[2]}
        stickySectionHeadersEnabled
        // contentContainerStyle={{justifyContent: 'center'}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FFA700']} tintColor="#FFA700" />
        }
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            handleLoadMore(nativeEvent);
          }
        }}
        scrollEventThrottle={15}
        renderItem={props => {
          if (loading || error || location == undefined) {
            return (
              <View style={styles.loaderContainer}>
                <LoadingIndicator style={styles.loaderStyle} isFlex isLoading={true} />
              </View>
            );
          }
          if ((!data || data?.getShops?.length === 0) && props.index < 1) {
            return EmptyList();
          }
          if (props.index < 1) {
            return (
              <RestaurantList
                activeTab={activeTab}
                location={location}
                loading={loading}
                error={error}
                data={props.section.data}
                loadMore={loadMore}
              />
            ); //empty list design
          }
          return null;
        }}
        renderSectionHeader={({section: {type}}) => {
          if (type === 'ADDRESS') {
            return (
              <>
                <ChangeAddress />
                <CategoryList horizontal homeRefreshing={refreshing} rightText="See all" />
              </>
            );
          } else if (type === 'RESTAURANTS') {
            return <RenderNavBar />;
          } else {
            return null;
          }
        }}
      />
      <ModalKycStatus />
    </>
  );
};

{
  /* <ScrollView
  stickyHeaderIndices={[2]}
  nestedScrollEnabled
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FFA700']} tintColor="#FFA700" />
  }
  onScroll={({nativeEvent}) => {
    if (isCloseToBottom(nativeEvent)) {
      handleLoadMore(nativeEvent);
    }
  }}
  scrollEventThrottle={15}>
  <View style={styles.adsContainer}>
    <AdvertisementSection />
  </View>
  <ChangeAddress />
  <CategoryList horizontal homeRefreshing={refreshing} rightText="See all" />
  <RenderNavBar />
  <RestaurantList location={location} loading={loading} error={error} data={data} loadMore={loadMore} />
  </ScrollView> */
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  contentContainer: {
    backgroundColor: 'white',
    paddingBottom: Platform.OS === 'android' ? 10 : 30,
    marginTop: Platform.OS === 'ios' ? moderateScale(20) : moderateScale(14),
  },
  headerWrapper: {
    paddingHorizontal: moderateScale(8),
    width: '100%',
    paddingTop: moderateScale(8),
    backgroundColor: 'white',
  },
  adsContainer: {
    height: 130,
    width: '100%',
  },
  emptyContainer: {
    alignItems: 'center',
    height: verticalScale(500),
    paddingTop: moderateScale(50),
    // justifyContent: 'center',
  },
  emptyImg: {
    width: moderateScale(193),
    height: moderateScale(146),
    right: moderateScale(5),
  },
  emptyTextTitle: {
    color: '#F6841F',
    fontSize: 17,
    marginTop: moderateScale(20),
    fontWeight: '700',
  },
  emptyText: {
    fontSize: FONT_SIZE.M,
    textAlign: 'center',
    marginTop: moderateScale(5),
    marginHorizontal: moderateScale(20),
    color: '#000',
  },
  loaderStyle: {
    // marginVertical: 30,
    justifyContent: 'flex-start',
  },
  loaderContainer: {
    justifyContent: 'flex-start',
    height: verticalScale(500),
    paddingTop: moderateScale(50),
  },
});

export default StickyView;
