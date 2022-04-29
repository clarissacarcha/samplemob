/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useContext, useMemo} from 'react';
import {useLazyQuery} from '@apollo/react-hooks';
import {useRoute} from '@react-navigation/native';
import {
  Image,
  ImageBackground,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import _ from 'lodash';

import {FONT_SIZE, FONT, COLOR, SIZE} from 'res/variables';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
// import CustomStarRating from 'toktokfood/components/CustomStarRating';
// import ChangeAddress from 'toktokfood/components/ChangeAddress';
import {time, email_ic} from 'toktokfood/assets/images';
import ContentLoader from 'react-native-easy-content-loader';

// Components
// import {RestaurantList} from '../../ToktokFoodHome/components';
// import HeaderTabs from 'toktokfood/components/HeaderTabs';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import {GET_PRODUCT_CATEGORIES, GET_PRODUCTS_BY_SHOP_CATEGORY, GET_SHOP_DETAILS} from 'toktokfood/graphql/toktokfood';
// Utils
import {
  getDeviceWidth,
  getStatusbarHeight,
  isIphoneXorAbove,
  moderateScale,
  scale,
  verticalScale,
} from 'toktokfood/helper/scale';
import {getWeekDay} from 'toktokfood/helper/strings';

import {FoodList, HeaderTitleSearchBox} from '../components';
import {VerifyContext, CategoryTabs} from '../components';
// import LoadingIndicator from '../../../../components/LoadingIndicator';

const phoneWindow = Dimensions.get('window');

export const StickyView = ({onCheckShop}) => {
  const routes = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState({});
  const [productCategories, setProductCategories] = useState([]);
  const [shopDetails, setShopDetails] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showProductOverlay, setShowProductOverlay] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [hasMorePage, setHasMorePage] = useState(true);
  // const [loadMore, setLoadMore] = useState(false);

  const [nextSched, setNextSched] = useState(null);

  const {setNavBarHeight} = useContext(VerifyContext);
  const {customerInfo, location} = useSelector(state => state.toktokFood);

  const {id} = routes.params.item;

  const headerMaxHeight = verticalScale(450);
  const headerMinHeight = verticalScale(110);
  const isFocus = useIsFocused();

  // data fetching for product tags/tabs
  const [getProductCategories, {data, loading}] = useLazyQuery(GET_PRODUCT_CATEGORIES, {
    variables: {
      input: {
        id: id,
      },
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
  });

  const [getShopDetails, {error: shopDetailsError, loading: shopDetailsLoading}] = useLazyQuery(GET_SHOP_DETAILS, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'cache-and-network',
    onCompleted: ({getShopDetails}) => {
      let {latitude, longitude, hasOpen, nextOperatingHrs, hasProduct} = getShopDetails;
      if (nextOperatingHrs) {
        setNextSched(nextOperatingHrs);
      }
      dispatch({type: 'SET_TOKTOKFOOD_SHOP_COORDINATES', payload: {latitude, longitude}});
      setShopDetails(getShopDetails);
      onCheckShop(hasOpen && hasProduct);
    },
  });

  const [getProductsByShopCategory, {data: categoryProducts, loading: productsLoading, fetchMore}] = useLazyQuery(
    GET_PRODUCTS_BY_SHOP_CATEGORY,
    {
      variables: {
        input: {
          id: id,
          catId: activeTab?.id,
          page: 0,
          // key: searchProduct,
        },
      },
      client: TOKTOK_FOOD_GRAPHQL_CLIENT,
      fetchPolicy: 'cache and network',
      // onCompleted: ({getProductsByShopCategory}) => {
      //   const products = getProductsByShopCategory;
      //   filterProducts(products);
      // },
    },
  );

  // const [checkShopValidations, {data: checkShop, loading: shopValidationLoading, error: shopValidationError}] =
  //   useLazyQuery(CHECK_SHOP_VALIDATIONS, {
  //     client: TOKTOK_FOOD_GRAPHQL_CLIENT,
  //     fetchPolicy: 'network-only',
  //   });

  useEffect(() => {
    // checkShopValidations({ variables: { input: { shopId: id } }})
    if (isFocus && location) {
      getProductCategories();
      getProductsByShopCategory();
      // console.log(
      //   JSON.stringify({
      //     input: {
      //       shopId: id,
      //       userLongitude: location?.longitude,
      //       userLatitude: location?.latitude,
      //     },
      //   }),
      // );
      getShopDetails({
        variables: {
          input: {
            shopId: id,
            userLongitude: location?.longitude,
            userLatitude: location?.latitude,
          },
        },
      });
    }
  }, [isFocus, location]);

  useEffect(() => {
    if (data) {
      let categories = data.getProductCategories;
      // categories.sort(function (a, b) {
      //   return a.categoryName > b.categoryName;
      // });
      // console.log(categories);

      setProductCategories(categories);
      setActiveTab(categories[0]);
    }
  }, [data]);

  const getNavBarHeight = event => {
    let height = event.nativeEvent.layout.height;
    setNavBarHeight(height);
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 220;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  const onLoadMore = () => {
    if (!showMore && hasMorePage) {
      setShowMore(true);
      fetchMore({
        variables: {
          input: {
            id: id,
            catId: activeTab?.id,
            page: page + 1,
          },
        },
        updateQuery: (previousResult, {fetchMoreResult}) => {
          setPage(page + 1);
          setShowMore(false);

          if (!fetchMoreResult) {
            return previousResult;
          }
          if (!fetchMoreResult?.getProductsByShopCategory.length) {
            setHasMorePage(false);
          }
          const mergeData = _.unionBy(
            previousResult.getProductsByShopCategory,
            fetchMoreResult.getProductsByShopCategory,
            'Id',
          );

          return {
            getProductsByShopCategory: mergeData,
          };
        },
      });
    }
  };

  const renderNavBar = useMemo(() => {
    return (
      <View onLayout={event => getNavBarHeight(event)} style={[styles.headerWrapper, styles.navbarWrapper]}>
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
  }, [activeTab, productCategories, loading]);

  const renderTitle = useMemo(() => {
    return (
      <View style={styles.title}>
        <ImageBackground
          source={{uri: shopDetails?.banner}}
          resizeMode="cover"
          imageStyle={styles.bannerImg}
          style={styles.banner}>
          <HeaderTitle backOnly searchBox={false} isFoodHome />
        </ImageBackground>

        <View style={styles.titleInfo}>
          {/* <ChangeAddress styleContainer={{paddingTop: moderateScale(10)}} /> */}
          {shopDetailsLoading || shopDetailsError || (shopDetails && Object.keys(shopDetails).length == 0) ? (
            <ContentLoader
              active
              pRows={4}
              pWidth={['40%', '80%', '30%', '60%']}
              title={false}
              primaryColor="#FFFFFF"
              secondaryColor="rgba(256,186,28,0.4)"
              aShape="square"
              aSize="large"
              avatar
            />
          ) : (
            <View style={styles.content}>
              <Image source={{uri: shopDetails?.logo}} style={styles.logo} resizeMode="cover" />
              <View style={{flexShrink: 1, marginHorizontal: 10}}>
                <Text style={styles.titleText}>{`${shopDetails?.shopname} (${shopDetails?.address})`}</Text>
                <View style={styles.branchInfo}>
                  <Image source={time} style={styles.timeImg} />
                  <Text style={styles.branches}>{`${shopDetails?.estimatedDeliveryTime} mins`}</Text>
                  <MCIcon name="map-marker-outline" color="#868686" size={13} />
                  <Text style={styles.branches}>{shopDetails?.estimatedDistance}</Text>
                </View>
                <Text style={{color: '#FFA700', fontSize: FONT_SIZE.S}}>
                  {shopDetails?.allowPickup ? 'Available for pick-up and delivery' : 'Available for delivery only'}
                </Text>

                <View style={styles.shopDetailsContainer}>
                  <MCIcon name="phone" color="#868686" size={13} />
                  <Text style={{fontSize: FONT_SIZE.S, marginHorizontal: 4}}>
                    {shopDetails?.mobile ? shopDetails?.mobile : ''}
                  </Text>
                  {/* <MCIcon name="email" color="#FFA700" size={13} /> */}
                  <Image source={email_ic} style={styles.emailImg} />
                  <Text style={{color: '#FFA700', fontSize: FONT_SIZE.S, marginStart: 4}}>
                    {shopDetails?.mobile ? shopDetails?.email : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}

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
  }, [shopDetails, shopDetailsLoading, productCategories, activeTab, loading]);

  const renderContent = useMemo(() => {
    return (
      <FoodList
        id={id}
        activeTab={activeTab}
        data={categoryProducts}
        productsLoading={productsLoading}
        showMore={showMore}
        tagsLoading={loading}
        shopDetails={shopDetails}
      />
    );
  }, [id, activeTab, categoryProducts, loading, productsLoading, showMore]);

  const OperatingHours = () => {
    const {operatingHours, dayLapsed, hasProduct} = shopDetails;
    const {fromTime: currFromTime} = operatingHours;
    const isAboutToOpen = moment().isBefore(moment(currFromTime, 'HH:mm:ss'));

    if (nextSched === null || !hasProduct) {
      return (
        <Text style={styles.closeText}>
          Restaurant is currently unavailable. {'\n'}Please come back at a later time.
        </Text>
      );
    }
    if (isAboutToOpen || dayLapsed === 0) {
      return (
        <Text style={styles.closeText}>
          Restaurant is currently closed. {'\n'}Please come back at{' '}
          {moment(dayLapsed === 0 ? nextSched.fromTime : currFromTime, 'hh:mm:ss').format('hh:mm A')}
        </Text>
      );
    }
    return (
      <Text style={styles.closeText}>
        Restaurant is currently closed. {'\n'}Please come back on {getWeekDay(nextSched.day, true)},{' '}
        {moment(nextSched.fromTime, 'hh:mm:ss').add(dayLapsed, 'day').format('MMMM DD')} at{' '}
        {moment(nextSched.fromTime, 'hh:mm:ss').format('hh:mm A')}.
      </Text>
    );
  };

  const onNavigate = () => {
    setShowOverlay(true);
    setShowProductOverlay(true);
    navigation.goBack();
  };

  const CloseOverlay = useMemo(
    () => (
      <Modal visible={!showOverlay} transparent={true} animationType="fade">
        <View style={styles.modalContent}>
          <View style={[styles.wrapper, styles.sheetBorder]}>
            <View style={styles.sheet}>
              {shopDetails && <OperatingHours />}
              <TouchableOpacity style={styles.closeButton} onPress={() => onNavigate()}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    ),
    [shopDetails, showOverlay],
  );

  const ProductOverlay = useMemo(
    () => (
      <Modal visible={!showProductOverlay} transparent={true} animationType="fade" presentationStyle="overFullScreen">
        <View style={styles.modalContent}>
          <View style={[styles.wrapper, styles.sheetBorder]}>
            <View style={styles.sheet}>
              <Text style={styles.closeText}>
                Restaurant is currently unavailable. {'\n'} Please come back at a later time
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => onNavigate()}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    ),
    [shopDetails, showProductOverlay],
  );
  // console.log(shopDetails)
  return (
    <>
      {shopDetails && !shopDetails?.hasOpen && shopDetails?.hasProduct && CloseOverlay}
      {shopDetails && !shopDetails?.hasProduct && ProductOverlay}
      <ReactNativeParallaxHeader
        alwaysShowNavBar={false}
        alwaysShowTitle={false}
        headerMinHeight={headerMinHeight}
        headerMaxHeight={headerMaxHeight}
        // headerTitleStyle={{zIndex: offset <= 132 ? 1 : -1, justifyContent: 'flex-start'}}
        extraScrollHeight={10}
        // backgroundImageScale={2}
        title={renderTitle}
        // backgroundImage={{uri: shopDetails.banner}}
        statusBarColor="transparent"
        navbarColor="white"
        backgroundColor="transparent"
        renderNavBar={() => renderNavBar}
        renderContent={() => renderContent}
        containerStyle={styles.container}
        contentContainerStyle={styles.contentContainer}
        scrollViewProps={{
          onScrollEndDrag: ({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              onLoadMore();
            }
          },
          // onScrollEndDrag: event => setOffset(event.nativeEvent.contentOffset.y),
          // onMomentumScrollEnd: event => setOffset(event.nativeEvent.contentOffset.y),
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  banner: {
    flex: 1,
    // height: 400,
    // paddingTop: 10,
  },
  bannerImg: {
    // height: 400,
    // width: 400,
  },
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
    paddingTop: 5,
  },
  contentContainer: {
    backgroundColor: 'white',
    paddingBottom: verticalScale(15),
  },
  headerWrapper: {
    elevation: 5,
    shadowRadius: 3,
    shadowOpacity: 0.3,
    shadowColor: '#000',
    backgroundColor: 'white',
    shadowOffset: {width: 1, height: 1},
    height: Platform.OS === 'ios' ? verticalScale(120) : verticalScale(130),
  },
  navbarWrapper: {
    // paddingTop: verticalScale(15),
    // marginTop: verticalScale(15),
  },
  ratings: {
    paddingVertical: 4,
    alignItems: 'flex-start',
  },
  shopDetailsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    marginTop: 2,
  },
  tabContainer: {
    paddingHorizontal: 10,
    marginTop: Platform.OS === 'ios' ? verticalScale(12) : verticalScale(10),
  },
  title: {
    flex: 1,
    width: getDeviceWidth,
    justifyContent: 'space-between',
    overflow: 'hidden',
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  titleText: {
    marginBottom: 6,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  timeImg: {
    width: scale(13),
    height: scale(13),
    tintColor: COLOR.DARK,
    resizeMode: 'contain',
  },
  logo: {
    width: scale(70),
    height: scale(70),
    borderRadius: 5,
  },
  emailImg: {
    width: scale(13),
    height: scale(13),
    resizeMode: 'contain',
  },
  modalContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(34, 34, 34, 0.5)',
  },
  wrapper: {
    width: getDeviceWidth + 10,
    paddingLeft: 5,
    paddingBottom: 20,
    position: 'absolute',
    backgroundColor: COLOR.WHITE,
  },
  sheetBorder: {
    borderTopWidth: 3,
    borderEndWidth: 2,
    borderStartWidth: 2,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    borderColor: COLOR.ORANGE,
    marginHorizontal: 0,
  },
  sheet: {
    flex: 1,
    paddingHorizontal: 10,
  },
  closeText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: FONT.BOLD,
    marginVertical: 20,
    textAlign: 'center',
  },
  closeButton: {
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: SIZE.BUTTON_HEIGHT,
    backgroundColor: '#FFA700',
    width: getDeviceWidth - 28,
  },
  buttonText: {
    color: COLOR.WHITE,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
});
