import React, {useState, useContext, useEffect} from 'react';
import {useRoute} from '@react-navigation/native';
import {Image, View, Text, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';

import MIcon from 'react-native-vector-icons/MaterialIcons';

import {FoodCart, VerifyContextProvider, VerifyContext} from './components';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';

import ContentLoader from 'react-native-easy-content-loader';

import {Variations} from './components';
import {useSelector} from 'react-redux';

import {scale, moderateScale} from 'toktokfood/helper/scale';
import styles from './styles';

import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {GET_PRODUCT_DETAILS, GET_TEMPORARY_CART} from 'toktokfood/graphql/toktokfood';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import ChangeAddress from 'toktokfood/components/ChangeAddress';
import { onErrorAlert } from 'src/util/ErrorUtility';
import { useAlert } from 'src/hooks';

const MainComponent = () => {

  const routes = useRoute();
  const alert = useAlert();
  const {Id, selectedAddons, selectedPrice, selectedQty, selectedNotes} = routes.params;
  const {customerInfo} = useSelector((state) => state.toktokFood);
  const {
    totalPrice,
    setTotalPrice,
    setSelected,
    productDetails,
    setProductDetails,
    setCount,
    temporaryCart,
    setTemporaryCart,
    setNotes
  } = useContext(VerifyContext);
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const stickyHeaderIndices = bannerLoaded ? [2] : [3];

  const [getProductDetails, {data, loading, error}] = useLazyQuery(GET_PRODUCT_DETAILS, {
    variables: {
      input: {
        product_id: Id
      },
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onError: (error) => {
      onErrorAlert({ alert, error })
    },
    onCompleted: ({getProductDetails}) => {
      setProductDetails(getProductDetails)
      getTemporaryCart({
        variables: {
          input: {
            shopId: +getProductDetails.sysShop,
            userId: customerInfo.userId
          },
        },
      })
    },
  });

  const [getTemporaryCart, {loading: getLoading, error: getError}] = useLazyQuery(GET_TEMPORARY_CART, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onError: (error) => {
      onErrorAlert({ alert, error })
    },
    onCompleted: ({getTemporaryCart}) => {
      let { items, totalAmount } = getTemporaryCart
      setTemporaryCart({
        cartItemsLength: items.length,
        totalAmount,
        items: items
      })
    },
  });

  useEffect(() => {
    if(selectedAddons){ setSelected(selectedAddons) }
    if(selectedPrice){ setTotalPrice(selectedPrice) }
    if(selectedQty){ setCount({ type: '', quantity: selectedQty }) }
    if(selectedNotes){ setNotes(selectedNotes) }
    getProductDetails()
  }, [routes.params]);
 
  const ItemDetails = () => {
    const {itemname, price, summary} = productDetails;
    return (
      <View style={styles.foodContainer}>
        <View style={styles.foodDetails}>
          <View style={styles.foodNameWrapper}>
            <Text style={styles.foodName}>{itemname}</Text>
            {/* <MIcon name="favorite-border" size={22} color="#808080" style={styles.heart} /> */}
          </View>
          <Text style={styles.foodPrice}>PHP {price?.toFixed(2)}</Text>
        </View>
        <View style={styles.ratingsWrapper}>
          {/* <Rating startingValue={ratings} imageSize={16} readonly style={styles.ratings} /> */}
          { !!summary && (
            <Text style={styles.description} numberOfLines={3}>
              {summary}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const BannerPlaceHolder = () => {
    return (
      <View style={{
        marginTop: scale(50),
        position: 'absolute',
        alignSelf: 'center',
        height: scale(140),
        width: scale(350)
      }}>
        <ContentLoader
          active
          pRows={1}
          pHeight="100%"
          pWidth="100%"
          title={false}
          primaryColor="rgba(256,186,28,0.2)"
          secondaryColor="rgba(256,186,28,0.7)"
        />
      </View>
    );
  };
 
  return (
    <View style={styles.container}>
      <HeaderImageBackground searchBox={false}>
        <HeaderTitle />
      </HeaderImageBackground>
      {(Object.entries(productDetails).length == 0) || getLoading || getError ? (
        <LoadingIndicator isLoading={true} isFlex />
        ) : (
        <>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null} style={styles.container}>
            <ScrollView stickyHeaderIndices={stickyHeaderIndices} >
              <ChangeAddress />
              {!bannerLoaded && <BannerPlaceHolder />}
              <Image
                onLoadEnd={() => setBannerLoaded(true)}
                source={{uri: productDetails.filename}}
                style={[styles.banner]}
              />
              <ItemDetails />
              <Variations item={productDetails.variants} basePrice={productDetails?.price} />
            </ScrollView>
          </KeyboardAvoidingView>
          <FoodCart loading={loading} basePrice={productDetails?.price} />
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

export default React.memo(ToktokFoodItemDetails);
