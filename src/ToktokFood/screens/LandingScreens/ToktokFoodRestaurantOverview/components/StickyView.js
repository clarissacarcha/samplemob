import {useLazyQuery} from '@apollo/react-hooks';
import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState, useContext, useRef, useMemo} from 'react';
import {Image, Platform, StyleSheet, Text, View, StatusBar} from 'react-native';
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {FONT_SIZE, FONT, COLOR} from 'res/variables';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import CustomStarRating from 'toktokfood/components/CustomStarRating';
import ChangeAddress from 'toktokfood/components/ChangeAddress';
import {time, email_ic} from 'toktokfood/assets/images';
import ContentLoader from 'react-native-easy-content-loader';

// Components
// import {RestaurantList} from '../../ToktokFoodHome/components';
import HeaderTabs from 'toktokfood/components/HeaderTabs';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import {GET_PRODUCT_CATEGORIES, CHECK_SHOP_VALIDATIONS, GET_SHOP_DETAILS} from 'toktokfood/graphql/toktokfood';
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
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import LoadingIndicator from '../../../../components/LoadingIndicator';

export const StickyView = () => {
  const routes = useRoute();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [activeTab, setActiveTab] = useState({});
  const [productCategories, setProductCategories] = useState([]);
  const [shopDetails, setShopDetails] = useState({});
  const searchProduct = useRef('');
  const {setNavBarHeight, temporaryCart, setTemporaryCart} = useContext(VerifyContext);
  const {customerInfo, location} = useSelector((state) => state.toktokFood);

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

  const headerMaxHeight = verticalScale(450);
  const headerMinHeight = verticalScale(110);
  const isFocus = useIsFocused();

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

  const [getShopDetails, {error: shopDetailsError, loading: shopDetailsLoading}] = useLazyQuery(GET_SHOP_DETAILS, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getShopDetails}) => {
      setShopDetails(getShopDetails);
    },
  });

  const [
    checkShopValidations,
    {data: checkShop, loading: shopValidationLoading, error: shopValidationError},
  ] = useLazyQuery(CHECK_SHOP_VALIDATIONS, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    // checkShopValidations({ variables: { input: { shopId: id } }})
    if (isFocus && location) {
      dispatch({type: 'SET_TOKTOKFOOD_SHOP_COORDINATES', payload: {latitude, longitude}});
      getProductCategories();
      console.log(
        JSON.stringify({
          input: {
            shopId: id,
            userLongitude: location?.longitude,
            userLatitude: location?.latitude,
          },
        }),
      );
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

  const renderNavBar = useMemo(() => {
    return (
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
  }, [activeTab, productCategories, loading]);

  const renderTitle = () => {
    return (
      <View style={styles.title}>
        <HeaderTitle backOnly searchBox={false} />
        <View style={styles.titleInfo}>
          <ChangeAddress styleContainer={{paddingTop: moderateScale(10)}} />
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
              <Image source={{ uri: shopDetails.logo }} style={styles.logo} resizeMode="cover" />
              <View style={{flexShrink: 1, marginHorizontal: 10}}>
                <Text numberOfLines={1} style={styles.titleText}>
                  {`${shopDetails.shopname} (${shopDetails.address})`}
                </Text>
                <CustomStarRating
                  rating={shopDetails.ratings ?? '0'}
                  starImgStyle={{width: scale(15), height: scale(15), marginVertical: 5}}
                  ratingStyle={{color: 'black', fontSize: FONT_SIZE.S}}
                  readOnly
                  showRating
                  rightRating
                />
                <View style={styles.branchInfo}>
                  <Image source={time} style={styles.timeImg} />
                  <Text style={styles.branches}>{`${shopDetails.estimatedDeliveryTime} mins`}</Text>
                  <MCIcon name="map-marker-outline" color="#868686" size={13} />
                  <Text style={styles.branches}>{shopDetails.estimatedDistance}</Text>
                </View>
                <Text style={{color: '#FFA700', fontSize: FONT_SIZE.S}}>
                  {shopDetails?.allowPickup ? 'Available for pick-up and delivery' : 'Available for delivery only'}
                </Text>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', paddingVertical: 3, marginTop: 2}}>
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
  };

  const renderContent = useMemo(() => {
    return <FoodList id={id} activeTab={activeTab} tagsLoading={loading} />;
  }, [id, activeTab, loading]);

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
        backgroundImage={{uri: shopDetails.banner}}
        statusBarColor="transparent"
        navbarColor="white"
        alwaysShowNavBar={false}
        backgroundColor="transparent"
        renderNavBar={() => renderNavBar}
        renderContent={() => renderContent}
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
    paddingTop: 5,
    alignItems: 'center',
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
});
