/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useContext, useEffect} from 'react';
import {useRoute} from '@react-navigation/native';
import {View, ImageBackground, Text, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';

import {FoodCart, VerifyContextProvider, VerifyContext, FoodImageSlider} from './components';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';

// import ContentLoader from 'react-native-easy-content-loader';

import {Variations} from './components';
import {useSelector} from 'react-redux';

import styles from './styles';

import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import {GET_PRODUCT_DETAILS, GET_TEMPORARY_CART} from 'toktokfood/graphql/toktokfood';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import {reseller_badge} from 'toktokfood/assets/images';
// import ChangeAddress from 'toktokfood/components/ChangeAddress';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useAlert} from 'src/hooks';

const MainComponent = () => {
  const routes = useRoute();
  const alert = useAlert();
  const {Id, parentProductId, selectedItemId, selectedAddons, selectedPrice, selectedQty, selectedNotes, action} =
    routes.params;
  const {customerInfo} = useSelector(state => state.toktokFood);

  const {
    // temporaryCart,
    // totalPrice,
    setTotalPrice,
    setSelected,
    productDetails,
    setProductDetails,
    setCount,
    setTemporaryCart,
    setNotes,
    selectedVariants,
    setBasePrice,
  } = useContext(VerifyContext);
  const [bannerLoaded, setBannerLoaded] = useState(true);
  const stickyHeaderIndices = bannerLoaded ? [2] : [3];

  const [getProductDetails, {loading}] = useLazyQuery(GET_PRODUCT_DETAILS, {
    variables: {
      input: {
        product_id: parentProductId ? parentProductId : Id,
      },
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onError: error => {
      onErrorAlert({alert, error});
    },
    onCompleted: ({getProductDetails}) => {
      setProductDetails(getProductDetails);
      // console.log(getProductDetails);
      getTemporaryCart({
        variables: {
          input: {
            shopId: +getProductDetails?.sysShop,
            userId: customerInfo.userId,
          },
        },
      });
    },
  });

  const [getTemporaryCart, {loading: getLoading, error: getError}] = useLazyQuery(GET_TEMPORARY_CART, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onError: error => {
      onErrorAlert({alert, error});
    },
    onCompleted: ({getTemporaryCart}) => {
      let {items, totalAmount} = getTemporaryCart;
      setTemporaryCart({
        cartItemsLength: items.length,
        totalAmount,
        items: items,
      });
    },
  });

  useEffect(() => {
    if (productDetails && Object.keys(productDetails).length > 0) {
      let basePrice = 0;
      if (productDetails?.variants.length > 0) {
        if (selectedVariants && Object.keys(selectedVariants).length > 0) {
          if (selectedVariants?.basePrice) {
            basePrice = parseFloat(selectedVariants?.basePrice);
          } else {
            basePrice = parseFloat(selectedVariants?.price);
          }
        }
      } else {
        basePrice = productDetails?.price || productDetails?.basePrice;
      }
      setBasePrice(basePrice);
    }
  }, [selectedVariants, productDetails]);

  useEffect(() => {
    if (selectedAddons) {
      setSelected(selectedAddons);
    }
    if (selectedPrice) {
      setTotalPrice(selectedPrice);
    }
    if (selectedQty) {
      setCount({type: '', quantity: selectedQty});
    }
    if (selectedNotes) {
      setNotes(selectedNotes);
    }
    getProductDetails();
  }, [routes.params]);

  const ResellerDiscountBadge = () => {
    const {discRatetype, referralDiscount} = productDetails?.resellerDiscount;
    const discountText = discRatetype === 'p' ? `-${referralDiscount * 100}%` : referralDiscount;
    return (
      <ImageBackground resizeMode="contain" source={reseller_badge} style={styles.resellerBadge}>
        <Text style={styles.resellerText}>Reseller {discountText}</Text>
      </ImageBackground>
    );
  };

  const ResellerPrice = () => {
    const {price, basePrice} = productDetails;

    return (
      <View style={styles.resellerPrice}>
        <Text style={styles.foodPrice}>PHP {price.toFixed(2)}</Text>
        <Text style={styles.resellerDiscountText}>PHP {basePrice?.toFixed(2)}</Text>
      </View>
    );
  };

  const ItemDetails = () => {
    const {itemname, basePrice, price, resellerDiscount, summary} = productDetails;
    return (
      <View style={styles.foodContainer}>
        {resellerDiscount?.referralShopRate > 0 && <ResellerDiscountBadge />}
        <View style={styles.foodDetails}>
          <View style={styles.foodNameWrapper}>
            <Text style={styles.foodName}>{itemname}</Text>
            {/* <MIcon name="favorite-border" size={22} color="#808080" style={styles.heart} /> */}
          </View>
          {resellerDiscount?.referralShopRate > 0 ? (
            <ResellerPrice />
          ) : (
            <Text style={styles.foodPrice}>PHP {basePrice?.toFixed(2)}</Text>
          )}
        </View>
        <View style={styles.ratingsWrapper}>
          {/* <Rating startingValue={ratings} imageSize={16} readonly style={styles.ratings} /> */}
          {!!summary && (
            <Text style={styles.description} numberOfLines={3}>
              {summary}
            </Text>
          )}
        </View>
      </View>
    );
  };

  // const BannerPlaceHolder = () => {
  //   return (
  //     <View
  //       style={{
  //         marginTop: scale(50),
  //         position: 'absolute',
  //         alignSelf: 'center',
  //         height: scale(140),
  //         width: scale(350),
  //       }}>
  //       <ContentLoader
  //         active
  //         pRows={1}
  //         pHeight="100%"
  //         pWidth="100%"
  //         title={false}
  //         primaryColor="rgba(256,186,28,0.2)"
  //         secondaryColor="rgba(256,186,28,0.7)"
  //       />
  //     </View>
  //   );
  // };

  return (
    <View style={styles.container}>
      <HeaderImageBackground searchBox={false}>
        <HeaderTitle />
      </HeaderImageBackground>
      {productDetails === null || Object.entries(productDetails).length === 0 || getLoading || getError ? (
        <LoadingIndicator isLoading={true} isFlex />
      ) : (
        <>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null} style={styles.container}>
            <ScrollView stickyHeaderIndices={stickyHeaderIndices}>
              <View style={styles.flex}>
                {/* <ChangeAddress /> */}
                {/* {!bannerLoaded && <BannerPlaceHolder />}
              <Image
                onLoadEnd={() => setBannerLoaded(true)}
                source={{uri: productDetails.filename}}
                style={[styles.banner]}
              /> */}
                <View style={styles.flex}>
                  <FoodImageSlider images={productDetails.productImages} />
                </View>
                <ItemDetails />
                <Variations
                  productId={selectedItemId ? Id : ''}
                  data={productDetails}
                  basePrice={productDetails?.basePrice}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          <FoodCart loading={loading} basePrice={0} action={action} />
        </>
      )}
    </View>
  );
};

const ToktokFoodItemDetails = () => {
  return (
    <VerifyContextProvider>
      <MainComponent />
    </VerifyContextProvider>
  );
};

export default ToktokFoodItemDetails;
