import {useLazyQuery} from '@apollo/react-hooks';
import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState, useContext} from 'react';
import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {FONT_SIZE} from 'res/variables';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import CustomStarRating from 'toktokfood/components/CustomStarRating';
// Components
// import {RestaurantList} from '../../ToktokFoodHome/components';
import HeaderTabs from 'toktokfood/components/HeaderTabs';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import {GET_PRODUCT_CATEGORIES} from 'toktokfood/graphql/toktokfood';
// Utils
import {
  getDeviceWidth,
  getStatusbarHeight,
  isIphoneXorAbove,
  moderateScale,
  scale,
  verticalScale,
} from 'toktokfood/helper/scale';
import {FoodList, HeaderTitleSearchBox} from '../components';
import {VerifyContext, CategoryTabs} from '../components';

import {useDispatch} from 'react-redux';

// const {height: SCREEN_HEIGHT} = Dimensions.get('window');
// const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
// const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
// const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 0) : 64;
// const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
export const StickyView = () => {
  const routes = useRoute();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [activeTab, setActiveTab] = useState({});
  const [productCategories, setProductCategories] = useState([]);
  const { setNavBarHeight } = useContext(VerifyContext);

  const {
    id,
    address,
    shopname,
    ratings,
    banner,
    estimatedDeliveryTime,
    estimatedDistance,
    logo,
    latitude,
    longitude,
  } = routes.params.item;

  const headerMaxHeight = Platform.OS === 'ios' ? scale(400) : scale(370);
  const headerMinHeight = Platform.OS === 'ios' ? moderateScale(120) : moderateScale(140);

  // data fetching for product tags/tabs
  const [getProductCategories, {data, error, loading}] = useLazyQuery(GET_PRODUCT_CATEGORIES, {
    variables: {
      input: {
        id: id,
      },
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    dispatch({type: 'SET_TOKTOKFOOD_SHOP_COORDINATES', payload: {latitude, longitude}});
    getProductCategories();
  }, []);

  useEffect(() => {
    if (data) {
      let categories = data.getProductCategories;
      categories.sort(function (a, b) {
        return a.categoryName > b.categoryName;
      });
      setProductCategories(categories);
      setActiveTab(categories[0]);
    }
  }, [data]);

  const getNavBarHeight = (event) => {
    let height = event.nativeEvent.layout.height;
    setNavBarHeight(height);
  };

  const NavBar = () => (
    <View onLayout={(event) => getNavBarHeight(event)} style={[styles.headerWrapper, styles.navbarWrapper]}>
      <HeaderTitleSearchBox />
      <View style={styles.tabContainer}>
        <CategoryTabs
          activeTab={activeTab}
          productCategories={productCategories}
          setActiveTab={setActiveTab}
          loading={loading}
        />
      </View>
    </View>
  );

  const renderTitle = () => (
    <View style={styles.title}>
      <View style={styles.titleContainer}>
        <HeaderTitle title={'toktokfood'} showAddress={true} />
      </View>
      <View style={styles.titleInfo}>
        <View style={styles.content}>
          <Image source={{uri: logo}} style={{width: scale(70), height: scale(70)}} resizeMode="contain" />
          <View style={{flexShrink: 1, marginHorizontal: 10}}>
            <Text numberOfLines={2} style={styles.titleText}>{`${shopname} (${address})`}</Text>
            <CustomStarRating
              rating={ratings ?? '0'}
              starImgStyle={{width: scale(15), height: scale(15), marginVertical: 5}}
              ratingStyle={{color: 'black', fontSize: FONT_SIZE.S}}
              readOnly
              showRating
              rightRating
            />
            <View style={styles.branchInfo}>
              <MCIcon name="clock-outline" color="#868686" size={13} />
              <Text style={styles.branches}>{`${estimatedDeliveryTime} mins`}</Text>
              <MCIcon name="map-marker-outline" color="#868686" size={13} />
              <Text style={styles.branches}>{estimatedDistance}</Text>
            </View>
          </View>
        </View>
        <View style={{paddingTop: 15}}>
          <CategoryTabs
            activeTab={activeTab}
            productCategories={productCategories}
            setActiveTab={setActiveTab}
            loading={loading}
          />
        </View>
      </View>
    </View>
  );

  return (
    <>
      <ReactNativeParallaxHeader
        alwaysShowNavBar={false}
        alwaysShowTitle={false}
        headerMinHeight={headerMinHeight}
        headerMaxHeight={headerMaxHeight}
        headerTitleStyle={{zIndex: offset <= 132 ? 1 : -1, justifyContent: 'flex-start'}}
        extraScrollHeight={10}
        backgroundImageScale={1.1}
        title={renderTitle()}
        backgroundImage={{uri: banner}}
        navbarColor="whitesmoke"
        backgroundColor="transparent"
        renderNavBar={() => <NavBar />}
        renderContent={() => (
          <FoodList latitude={latitude} longitude={longitude} id={id} activeTab={activeTab} tagsLoading={loading} />
        )}
        containerStyle={styles.container}
        contentContainerStyle={styles.contentContainer}
        scrollViewProps={{
          onScrollEndDrag: (event) => setOffset(event.nativeEvent.contentOffset.y),
          onMomentumScrollEnd: (event) => setOffset(event.nativeEvent.contentOffset.y),
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  branches: {
    fontWeight: '400',
    fontSize: 10,
    paddingHorizontal: 3,
  },
  branchInfo: {
    flexDirection: 'row',
    marginBottom: verticalScale(5),
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingHorizontal: moderateScale(10),
    flexDirection: 'row',
  },
  contentContainer: {
    backgroundColor: 'white',
    paddingBottom: verticalScale(15),
    // marginTop: Platform.OS === 'ios' ? verticalScale(4) : 0,
  },
  headerWrapper: {
    elevation: 5,
    shadowRadius: 3,
    shadowOpacity: 0.4,
    shadowColor: '#000',
    backgroundColor: 'white',
    shadowOffset: {width: 1, height: 1},
    height: Platform.OS === 'ios' ? scale(120) : scale(145),
  },
  navbarWrapper: {
    // paddingTop: verticalScale(15),
    // marginTop: verticalScale(15),
  },
  ratings: {
    paddingVertical: 4,
    alignItems: 'flex-start',
  },
  tabContainer: {
    paddingHorizontal: 10,
    marginTop: Platform.OS === 'ios' ? verticalScale(12) : verticalScale(10),
  },
  title: {
    flex: 1,
    width: getDeviceWidth,
    justifyContent: 'space-between',
  },
  titleContainer: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    bottom:
      Platform.OS === 'ios'
        ? isIphoneXorAbove()
          ? verticalScale(getStatusbarHeight + 37)
          : verticalScale(getStatusbarHeight + 20)
        : verticalScale(0),
    height: Platform.OS === 'android' ? moderateScale(88 + getStatusbarHeight) : moderateScale(105),
  },
  titleInfo: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  titleText: {
    fontWeight: '500',
    fontSize: 15,
  },
});
