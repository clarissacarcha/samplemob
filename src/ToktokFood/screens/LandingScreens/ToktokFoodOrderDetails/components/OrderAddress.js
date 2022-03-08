/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import RatingModal from 'toktokfood/components/RatingModal';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';
import {RATE_SHOP, CHECK_IF_SHOP_WAS_RATED} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import {useNavigation} from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import DashedLine from 'react-native-dashed-line';
import Separator from 'toktokfood/components/Separator';
// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE, FONT, COLOR} from 'res/variables';

// Images
import {locationOutline, phoneBlack, store, user} from 'toktokfood/assets/images';

// Utils
import {moderateScale, verticalScale, isIphoneXorAbove} from 'toktokfood/helper/scale';
import DialogMessage from 'toktokfood/components/DialogMessage';

const OrderAddress = ({transaction, riderDetails}) => {
  const isFocus = useIsFocused();
  const navigation = useNavigation();
  const {location} = useSelector(state => state.toktokFood);
  const {shopDetails, orderStatus, referenceNum, sysShop, name, email, orderIsfor, conno} = transaction;
  const {shopname, address, logo} = shopDetails;
  const [ratingModal, setRatingModal] = useState(false);
  const [isRated, setIsRated] = useState(false);
  const [rating, setRating] = useState('0');
  const [showSuccess, setShowSuccess] = useState(false);

  const [rateShop, {loading, error}] = useMutation(RATE_SHOP, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    onCompleted: ({rateShop}) => {
      if (rateShop.status == 200) {
        setRatingModal(false);
        setShowSuccess(true);
      }
    },
  });

  const [checkIfShopWasRated, {loading: loadingIsRated, error: errorIsRated}] = useLazyQuery(CHECK_IF_SHOP_WAS_RATED, {
    variables: {
      input: {
        referenceNum: referenceNum,
      },
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({checkIfShopWasRated}) => {
      setIsRated(checkIfShopWasRated.status);
    },
  });

  useEffect(() => {
    checkIfShopWasRated();
  }, []);

  const onPressRate = () => {
    setRatingModal(true);
  };

  const onPressSumbit = () => {
    if (rating == 0) {
      return setRatingModal(false);
    }
    rateShop({
      variables: {
        input: {
          shopid: parseInt(sysShop),
          branchid: parseInt(sysShop),
          name: name,
          email: email,
          rating: parseInt(rating),
          reference_num: referenceNum,
        },
      },
    });
  };

  const renderDash = () => (
    <View style={styles.dashedLine}>
      <DashedLine axis="vertical" dashGap={2} dashColor="#DDDDDD" dashLength={3} />
    </View>
  );

  return (
    <View style={styles.addressContainer}>
      <DialogMessage
        type="success"
        visibility={showSuccess}
        hasChildren
        onCloseModal={() => {
          setShowSuccess(false);
          navigation.navigate('ToktokFoodHome');
        }}>
        <Text style={{fontSize: FONT_SIZE.XL, fontFamily: FONT.BOLD}}>Thank you for ordering</Text>
        <Text>
          <Text style={{fontSize: FONT_SIZE.XL, fontFamily: FONT.BOLD, color: COLORS.YELLOW}}>toktok</Text>
          <Text style={{fontSize: FONT_SIZE.XL, fontFamily: FONT.BOLD, color: '#FFA700'}}>food</Text>
          <Text style={{fontSize: FONT_SIZE.XL, fontFamily: FONT.BOLD}}>!</Text>
        </Text>
      </DialogMessage>
      <RatingModal
        visibility={ratingModal}
        onCloseModal={() => {
          onPressSumbit();
        }}
        btnTitle="Submit"
        imgSrc={logo}
        rating={rating}
        onFinishRating={rate => setRating(rate)}
        loading={loading}>
        <Text style={styles.messageTitle}>{'Deliver to:'}</Text>
        <Text style={styles.messageContent}>{location.address}</Text>
        <Text style={styles.rateTitle}>{`How's your experience with ${shopname}?`}</Text>
      </RatingModal>
      {orderIsfor == 1 && (
        <View style={styles.dividerContainer}>
          <FIcon5 name="circle" color={COLORS.YELLOWTEXT} size={15} />
          {renderDash()}
          {riderDetails != null && (orderStatus == 'f' || orderStatus == 's') ? (
            <MaterialIcon name="lens" size={16} color={COLORS.YELLOWTEXT} />
          ) : (
            <FIcon5 name="circle" color={COLORS.YELLOWTEXT} size={15} />
          )}
        </View>
      )}
      <View style={styles.addressInfo}>
        <View style={styles.flexDirection}>
          <Text style={styles.restaurant}>Restaurant</Text>
          {/* {(orderStatus == 's' && !isRated) && (
            <Text onPress={onPressRate} style={styles.rateText}>Rate</Text>
          )} */}
        </View>
        <View style={styles.restauranContainer}>
          <Image style={styles.icons} source={locationOutline} resizeMode="contain" />
          <Text style={styles.addressText}>{address}</Text>
        </View>
        <View style={styles.restauranContainer}>
          <Image style={styles.icons} source={store} resizeMode="contain" />
          <Text style={styles.addressText}>{shopname}</Text>
        </View>
        {orderIsfor === 1 && (
          <>
            <View style={styles.horizontalContainer} />
            <Text style={styles.restaurant}>Deliver to</Text>
            <View style={styles.restauranContainer}>
              <Image style={styles.icons} source={locationOutline} resizeMode="contain" />
              <View style={styles.addressWrapper}>
                <Text font style={styles.addressText} numberOfLines={1}>
                  {transaction?.address ? transaction.address : ''}
                </Text>
                {transaction?.landmark != undefined && transaction?.landmark !== '' && (
                  <Text
                    font
                    numberOfLines={2}
                    style={[styles.addressText, {color: '#525252', marginTop: transaction.landmark === '' ? 0 : 4}]}>
                    Landmark: {transaction.landmark}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.restauranContainer}>
              <Image style={styles.icons} source={user} resizeMode="contain" />
              <Text style={styles.addressText}>{name}</Text>
            </View>
            <View style={styles.restauranContainer}>
              <Image style={styles.icons} source={phoneBlack} resizeMode="contain" />
              <Text style={styles.addressText}>{conno}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default OrderAddress;

const styles = StyleSheet.create({
  addressContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: moderateScale(20),
    paddingHorizontal: moderateScale(20),
  },
  addressInfo: {
    flex: 1,
    paddingHorizontal: moderateScale(10),
  },
  addressText: {
    fontWeight: '300',
    fontSize: FONT_SIZE.S,
    marginLeft: 5,
  },
  dividerContainer: {
    height: verticalScale(83),
  },
  divider: {
    alignSelf: 'center',
    borderColor: '#DDDDDD',
    borderWidth: 0.4,
    flex: 1,
  },
  horizontalContainer: {
    borderColor: '#DDDDDD',
    borderTopWidth: 1,
    marginVertical: verticalScale(4),
    marginBottom: verticalScale(6),
  },
  horizontalDivider: {
    borderColor: '#DDDDDD',
    borderWidth: 0.4,
  },
  icons: {
    width: 12,
    height: 12,
  },
  restaurant: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.BOLD,
    marginBottom: moderateScale(5),
  },
  restauranContainer: {
    flexDirection: 'row',
    marginVertical: moderateScale(3),
  },
  flexDirection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rateText: {
    fontSize: FONT_SIZE.M,
    color: '#FFA700',
  },
  messageTitle: {
    fontSize: FONT_SIZE.S,
    fontFamily: FONT.BOLD,
  },
  messageContent: {
    textAlign: 'center',
    fontSize: FONT_SIZE.S,
    fontFamily: FONT.REGULAR,
  },
  rateTitle: {
    textAlign: 'center',
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.BOLD,
    paddingVertical: 10,
  },
  dashedLine: {
    paddingLeft: moderateScale(6),
    flex: isIphoneXorAbove() ? 0.7 : 1,
    flexDirection: 'row',
  },
  addressWrapper: {
    flexDirection: 'column',
  },
});
