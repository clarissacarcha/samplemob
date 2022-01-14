import React, {useState, useEffect} from 'react';
import {Image, View, StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import ContentLoader from 'react-native-easy-content-loader';

import {FONT, FONT_SIZE, COLOR} from 'res/variables';
import {markerIcon, cart_ic} from 'toktokfood/assets/images';

import {getStatusbarHeight, verticalScale, moderateScale} from 'toktokfood/helper/scale';

import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import {GET_ALL_TEMPORARY_CART} from 'toktokfood/graphql/toktokfood';
import {useIsFocused} from '@react-navigation/native';

const HeaderTitle = ({title = '', searchBox = true, backOnly = false, isHome = false}) => {
  const navigation = useNavigation();
  const {location} = useSelector(state => state.toktokFood);
  const [allTemporaryCart, setAllTemporaryCart] = useState({
    cartItemsLength: 0,
    totalAmount: 0,
    items: [],
  });
  const [showEmptyCart, setShowEmptyCart] = useState(false);
  const {customerInfo} = useSelector(state => state.toktokFood);
  const isFocus = useIsFocused();

  const [getAllTemporaryCart, {loading, error}] = useLazyQuery(GET_ALL_TEMPORARY_CART, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getAllTemporaryCart}) => {
      let {items, totalAmount} = getAllTemporaryCart;
      setAllTemporaryCart({
        cartItemsLength: items.length,
        totalAmount,
        items: items,
      });
    },
  });

  useEffect(() => {
    if (isFocus && customerInfo) {
      // console.log('FF: ' + JSON.stringify(customerInfo));
      getAllTemporaryCart({
        variables: {
          input: {
            userId: customerInfo.userId,
          },
        },
      });
    }
  }, [isFocus, customerInfo]);

  const onSetLocationDetails = () => {
    navigation.navigate('ToktokFoodAddressDetails');
  };

  const renderText = () => (
    <View style={styles.addressContainer}>
      <Text style={styles.headerLabel}>{title}</Text>
      <View onTouchEndCapture={() => onSetLocationDetails()} style={styles.textAddressContainer}>
        <Image style={styles.addressMarkerIcon} source={markerIcon} />
        <Text style={styles.textAddress} numberOfLines={2}>
          {location.address}
        </Text>
      </View>
    </View>
  );

  const renderLoader = () => (
    <ContentLoader
      active
      pRows={2}
      pWidth={['40%', '70%']}
      title={false}
      primaryColor="#FFFFFF"
      secondaryColor="rgba(256,186,28,0.4)"
    />
  );

  const onBack = () => {
    isHome ? navigation.navigate('ToktokLandingHome') : navigation.goBack();
  };

  const onPressCart = () => {
    if (allTemporaryCart.cartItemsLength > 0) {
      navigation.navigate('ToktokFoodCart', {userId: customerInfo.userId});
    } else {
      navigation.navigate('ToktokFoodEmptyCart');
    }
  };

  if (backOnly) {
    return (
      <View style={[styles.backContainer, {marginTop: getStatusbarHeight}]}>
        <TouchableOpacity hitSlop={styles.hitSlop} onPress={onBack} style={styles.headerBack}>
          <FIcon5 name="chevron-left" size={15} />
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <>
      <View
        style={[
          styles.container,
          {
            marginTop: getStatusbarHeight,
            paddingVertical: Platform.OS == 'android' ? moderateScale(20) : moderateScale(searchBox ? 20 : 10),
          },
        ]}>
        <TouchableOpacity hitSlop={styles.hitSlop} onPress={onBack} style={styles.headerBack}>
          <FIcon5 name="chevron-left" size={15} />
        </TouchableOpacity>
        {loading || error ? (
          <LoadingIndicator isLoading={true} size="small" />
        ) : (
          <TouchableOpacity onPress={onPressCart} style={styles.headerBack}>
            {allTemporaryCart.cartItemsLength > 0 && (
              <View
                style={{
                  right: -10,
                  top: -10,
                  position: 'absolute',
                  backgroundColor: '#FFA700',
                  paddingHorizontal: 5,
                  zIndex: 1,
                  borderRadius: 10,
                }}>
                <Text style={{padding: 1, color: 'white', fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S}}>
                  {allTemporaryCart.cartItemsLength}
                </Text>
              </View>
            )}
            <Image
              source={cart_ic}
              style={{
                width: moderateScale(20),
                height: moderateScale(20),
                marginRight: allTemporaryCart.cartItemsLength > 9 ? 4 : 0,
              }}
            />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default HeaderTitle;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
  },
  backContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: Platform.OS == 'android' ? moderateScale(20) : 0,
  },
  headerWithAddress: {
    flexDirection: 'row',
    paddingTop: Platform.OS === 'android' ? verticalScale(getStatusbarHeight + 15) : verticalScale(25),
  },
  headerWithoutAddress: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBack: {
    justifyContent: 'center',
  },
  headerLabel: {
    marginLeft: 2,
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.XL,
    fontFamily: FONT.BOLD,
  },
  headerTextContainer: {
    flex: 1,
  },
  addressContainer: {
    paddingRight: 10,
  },
  textAddressContainer: {
    alignItems: 'center',
    maxWidth: '90%',
    flexDirection: 'row',
  },
  textAddress: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
  },
  addressMarkerIcon: {
    width: 18,
    height: 18,
    marginRight: 4,
  },
  hitSlop: {
    top: moderateScale(40),
    bottom: moderateScale(40),
    left: moderateScale(40),
    right: moderateScale(40),
  },
});
