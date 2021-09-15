import React, { useState, useEffect } from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import RatingModal from 'toktokfood/components/RatingModal';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';
import {RATE_SHOP, CHECK_IF_SHOP_WAS_RATED} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import {useNavigation} from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

// Fonts/Colors
import {COLORS, FONTS} from 'res/constants';
import {FONT_SIZE} from 'res/variables';

// Images
import {locationOutline, phoneBlack, store, user, rider1} from 'toktokfood/assets/images';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';
import DialogMessage from 'toktokfood/components/DialogMessage';

const OrderAddress = ({ transaction, riderDetails }) => {
  
  const isFocus = useIsFocused();
  const navigation = useNavigation();
  const {location} = useSelector((state) => state.toktokFood);
  const { shopDetails, orderStatus, referenceNum, sysShop, name, email, orderIsfor } = transaction;
  const { shopname, address, logo } = shopDetails;
  const {person, username} = useSelector((state) => state.session.user);
  const fullname = `${person.firstName} ${person.lastName}`;
  const [ratingModal, setRatingModal] = useState(false);
  const [isRated, setIsRated] = useState(false);
  const [rating, setRating] = useState("0");
  const [showSuccess, setShowSuccess] = useState(false);

  const [rateShop, {loading, error}] = useMutation(RATE_SHOP, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    onCompleted: ({rateShop}) => {
      if (rateShop.status == 200) {
        setRatingModal(false)
        setShowSuccess(true)
      }
    },
  });

  const [checkIfShopWasRated, {loading: loadingIsRated, error: errorIsRated}] = useLazyQuery(CHECK_IF_SHOP_WAS_RATED, {
    variables: {
      input: {
        referenceNum: referenceNum
      }
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({checkIfShopWasRated}) => {
      setIsRated(checkIfShopWasRated.status)
    },
  });

  useEffect(() => {
    checkIfShopWasRated()
  }, [])

  const onPressRate = () => { setRatingModal(true) }

  const onPressSumbit = () => {
    if(rating == 0){ return setRatingModal(false) }
    rateShop({
      variables: {
        input: {
          shopid: parseInt(sysShop),
          branchid: parseInt(sysShop),
          name: name,
          email: email,
          rating: parseInt(rating),
          reference_num: referenceNum
        }
      }
    })
  }

  return (
    <View style={styles.addressContainer}>
      <DialogMessage
        type="success"
        visibility={showSuccess}
        hasChildren
        onCloseModal={() => {
          setShowSuccess(false)
          navigation.navigate('ToktokFoodHome')
        }}
      >
        <Text style={{ fontSize: FONT_SIZE.XL, fontFamily: FONTS.BOLD }} >Thank you for ordering</Text>
        <Text>
          <Text style={{ fontSize: FONT_SIZE.XL, fontFamily: FONTS.BOLD, color: COLORS.YELLOW }} >toktok</Text>
          <Text style={{ fontSize: FONT_SIZE.XL, fontFamily: FONTS.BOLD, color: '#FFA700' }}>food</Text>
          <Text style={{ fontSize: FONT_SIZE.XL, fontFamily: FONTS.BOLD }}>!</Text>
        </Text>
      </DialogMessage>
      <RatingModal
        visibility={ratingModal}
        onCloseModal={() => {
          onPressSumbit()
        }}
        btnTitle="Submit"
        imgSrc={logo}
        rating={rating}
        onFinishRating={(rate) => setRating(rate)}
        loading={loading}
      >
        <Text style={styles.messageTitle}>{"Deliver to:"}</Text>
        <Text style={styles.messageContent}>{location.address}</Text>
        <Text style={styles.rateTitle}>{`How's your experience with ${shopname}?`}</Text>
      </RatingModal>
      {orderIsfor == 1 && (
        <View style={styles.dividerContainer}>
          <FIcon5 name="circle" color={COLORS.YELLOWTEXT} size={15} />
          <View style={styles.divider} />
          {(riderDetails != null && (orderStatus == 'f' || orderStatus == 's')) ? (
              <MaterialIcon name="lens" size={16} color={COLORS.YELLOWTEXT} />
            ) : (
              <FIcon5 name="circle" color={COLORS.YELLOWTEXT} size={15} />
          )}
        </View>
      )}
      <View style={styles.addressInfo}>
        <View style={styles.flexDirection}>
          <Text style={styles.restaurant}>Restaurant</Text>
          {(orderStatus == 's' && !isRated) && (
            <Text onPress={onPressRate} style={styles.rateText}>Rate</Text>
          )}
        </View>
        <View style={styles.restauranContainer}>
          <Image style={styles.icons} source={locationOutline} resizeMode="contain" />
          <Text style={styles.addressText}>{address}</Text>
        </View>
        <View style={styles.restauranContainer}>
          <Image style={styles.icons} source={store} resizeMode="contain" />
          <Text style={styles.addressText}>{shopname}</Text>
        </View>
        { orderIsfor == 1 && (
          <>
            <View style={styles.horizontalContainer} />
              <Text style={styles.restaurant}>Deliver to</Text>
              <View style={styles.restauranContainer}>
                <Image style={styles.icons} source={locationOutline} resizeMode="contain" />
                <Text font style={styles.addressText} numberOfLines={1}>
                {location ? location.address : ''}
              </Text>
            </View>
            <View style={styles.restauranContainer}>
              <Image style={styles.icons} source={user} resizeMode="contain" />
              <Text style={styles.addressText}>{fullname}</Text>
            </View>
            <View style={styles.restauranContainer}>
              <Image style={styles.icons} source={phoneBlack} resizeMode="contain" />
              <Text style={styles.addressText}>{username}</Text>
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
    height: verticalScale(64),
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
    fontWeight: '500',
    fontSize: FONT_SIZE.M,
  },
  restauranContainer: {
    flexDirection: 'row',
    marginVertical: moderateScale(3),
  },
  flexDirection: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  rateText: {
    fontSize: FONT_SIZE.M,
    color: "#FFA700",
  },
  messageTitle: {
    fontSize: FONT_SIZE.S, 
    fontFamily: FONTS.BOLD
  },
  messageContent: {
    textAlign: 'center',
    fontSize: FONT_SIZE.S,
    fontFamily: FONTS.REGULAR,
  },
  rateTitle: {
    textAlign: 'center',
    fontSize: FONT_SIZE.M,
    fontFamily: FONTS.BOLD,
    paddingVertical: 10
  }
});
