/* eslint-disable react-hooks/exhaustive-deps */
import {useLazyQuery} from '@apollo/react-hooks';
import React, {useEffect, useRef, useState} from 'react';
import {Platform, RefreshControl, ScrollView, StyleSheet, View, SectionList, Text, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import ChangeAddress from 'toktokfood/components/ChangeAddress';
import HeaderTabs from 'toktokfood/components/HeaderTabs';
import {GET_SHOPS} from 'toktokfood/graphql/toktokfood';

import {FONT_SIZE} from 'res/variables';
import {empty_shop_2} from 'toktokfood/assets/images';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';
// Components
import {CategoryList, ModalKycStatus, RestaurantList} from './index';
// import RestaurantItem from './RestaurantList/RestaurantItem';

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
  let variableInput = {
    limit: 10,
    radius: 3,
    userLongitude: location?.longitude,
    userLatitude: location?.latitude,
    tabId: activeTab.id,
  };

  // console.log(variableInput);
  // const scrollRef = useRef();

  // data fetching for shops
  const [getShops, {data, error, loading, fetchMore, refetch}] = useLazyQuery(GET_SHOPS, {
    onError: () => {
      setRefreshing(false);
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (location) {
      getShops({
        variables: {
          input: {
            page: 0,
            limit: 10,
            radius: 3,
            userLongitude: location?.longitude,
            userLatitude: location?.latitude,
            tabId: activeTab.id,
          },
        },
      });
    }
  }, [location, activeTab]);

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

  const sample = [
    {type: 'ADDRESS', data: []}, // Static sections.
    {type: 'CATEGORIES', data: []},
    {type: 'RESTAURANTS', data: data ? data.getShops : [{index: 1}]},
  ];

  const EmptyList = () => {
    return (
      <>
        <View style={styles.emptyContainer}>
          <Image style={styles.emptyImg} resizeMode="contain" source={empty_shop_2} />
          <Text style={styles.emptyText}>
            It seems like there is no open restaurant near you. Refresh or try again later.
          </Text>
        </View>
      </>
    );
  };

  return (
    <>
      <SectionList
        sections={sample}
        keyExtractor={(item, index) => item + index}
        stickyHeaderIndices={[2]}
        stickySectionHeadersEnabled
        contentContainerStyle={{justifyContent: 'center'}}
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
          if (props.index < 1) {
            return (
              <RestaurantList
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

      {/* <ScrollView
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
        scrollEventThrottle={15}> */}
      {/* <View style={styles.adsContainer}>
          <AdvertisementSection />
        </View> */}
      {/* <ChangeAddress />
        <CategoryList horizontal homeRefreshing={refreshing} rightText="See all" />
        <RenderNavBar /> */}
      {/* <RestaurantList location={location} loading={loading} error={error} data={data} loadMore={loadMore} /> */}
      {/* </ScrollView> */}
    </>
  );
};

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
    height: verticalScale(300),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImg: {
    height: moderateScale(175),
    width: moderateScale(250),
  },
  emptyText: {
    color: '#9E9E9E',
    fontSize: FONT_SIZE.L,
    textAlign: 'center',
    marginTop: moderateScale(20),
    marginHorizontal: moderateScale(20),
  },
});

export default StickyView;
