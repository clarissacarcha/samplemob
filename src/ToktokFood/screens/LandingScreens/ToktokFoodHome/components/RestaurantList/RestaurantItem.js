import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// import CustomStarRating from 'toktokfood/components/CustomStarRating';

// Assets & Utils
import {moderateScale, scale, getDeviceWidth} from 'toktokfood/helper/scale';
import {getWeekDay} from 'toktokfood/helper/strings';
import {time, no_image} from 'toktokfood/assets/images';

// Fonts, Colors & Images
import {COLOR, FONT, FONT_SIZE} from 'res/variables';
import moment from 'moment';

const RestaurantItem = ({activeTab, item}) => {
  const navigation = useNavigation();
  const [validImg, setValidImg] = useState(true);
  const {id} = activeTab;
  const {hasOpen, nextOperatingHrs, operatingHours} = item;
  const {fromTime, day: nxtDay} = nextOperatingHrs;
  const {fromTime: currFromTime} = operatingHours;

  const displayNextOpeningHours = () => {
    if (hasOpen) {
      return null;
    }
    const isAboutToOpen = moment().isBefore(moment(currFromTime, 'HH:mm:ss'));
    if (isAboutToOpen) {
      return <Text style={styles.overlayText}>Opens at {moment(fromTime, 'hh:mm:ss').format('LT')}</Text>;
    }
    return (
      <Text style={styles.overlayText}>
        Opens on {getWeekDay(nxtDay)} {moment(fromTime, 'hh:mm:ss').format('LT')}
      </Text>
    );
  };

  const onRestaurantNavigate = () => {
    navigation.navigate('ToktokFoodRestaurantOverview', {item});
  };

  const renderPromos = ({item}) => (
    <View style={styles.promoChip}>
      <Text numberOfLines={1} style={styles.promoText}>
        {item.shippingDiscountName}
      </Text>
    </View>
  );

  const renderPromosByAdmin = ({item}) => (
    <View style={styles.promoChipAdmin}>
      <Text numberOfLines={1} style={styles.promoText}>
        {item.shippingDiscountName}
      </Text>
    </View>
  );

  const renderPromotionVouchers = () => (
    <View style={styles.promotionChipAdmin}>
      <Text numberOfLines={1} style={styles.promoText}>
        {item?.promotionVouchers[0].voucherName}
      </Text>
    </View>
  );

  return (
    <View>
      <TouchableOpacity onPress={() => onRestaurantNavigate(item)}>
        <View style={styles.overlayContainer}>
          <Image
            style={styles.img}
            source={validImg ? {uri: item.logo, cache: 'default'} : no_image}
            resizeMode="cover"
            onError={() => setValidImg(false)}
          />
          <View style={{...styles.overlay, opacity: hasOpen ? 0 : 0.6}} />
          {displayNextOpeningHours()}
        </View>
        {item.promotionVouchers.length > 0 && id === 2 && renderPromotionVouchers()}
      </TouchableOpacity>

      <View style={styles.restaurantInfo}>
        <Text numberOfLines={1} style={styles.restaurantName}>{`${item.shopname} (${item.address})`}</Text>
        <View style={styles.branchInfo}>
          <Image resizeMode="contain" source={time} style={styles.timeImg} />
          <Text style={styles.branches}>{`${item.estimatedDeliveryTime} mins`}</Text>
          <MCIcon name="map-marker-outline" color={'#868686'} size={13} />
          <Text style={styles.branches}>
            {item.estimatedDistance.indexOf('KM') === -1 ? `${item.estimatedDistance} KM` : item.estimatedDistance}
          </Text>
        </View>

        {id === 2 && (
          <React.Fragment>
            <FlatList
              data={item?.promoByAdmin}
              renderItem={renderPromosByAdmin}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
            <FlatList
              data={item?.promoByMerchant}
              renderItem={renderPromos}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </React.Fragment>
        )}
      </View>
    </View>
  );
};
// onPress={() => onRestaurantNavigate(item)}
// , width: item?.promoName?.length <= 10 ? 100 : 180
const styles = StyleSheet.create({
  banner: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFE389',
    borderTopRightRadius: 10,
    padding: moderateScale(5),
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  branchInfo: {
    flexDirection: 'row',
    marginVertical: moderateScale(5),
  },
  branches: {
    fontWeight: '400',
    paddingHorizontal: 3,
    fontSize: Platform.OS === 'android' ? 9 : 10,
  },
  img: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  overlayContainer: {
    width: '90%',
    height: 150,
    borderRadius: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    borderRadius: 10,
  },
  overlayText: {
    fontWeight: 'bold',
    opacity: 1,
    position: 'absolute',
    alignSelf: 'center',
    top: '45%',
    color: '#fff',
    fontSize: 14,
  },
  ratings: {
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  restaurantInfo: {
    paddingVertical: 10,
    paddingRight: scale(20),
    width: (getDeviceWidth - 20) / 2,
  },
  restaurantList: {
    width: (getDeviceWidth - 20) / 2,
  },
  restaurantName: {
    flex: 1,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.BOLD,
  },
  timeImg: {
    width: scale(13),
    height: scale(13),
    tintColor: COLOR.DARK,
    resizeMode: 'contain',
  },
  promoChip: {
    alignItems: 'center',
    backgroundColor: '#FFCF2A',
    borderRadius: 5,
    height: scale(27),
    justifyContent: 'center',
    marginTop: moderateScale(5),
    marginRight: moderateScale(5),
    paddingHorizontal: moderateScale(5),
  },
  promoChipAdmin: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFA700',
    borderRadius: 5,
    height: scale(27),
    justifyContent: 'center',
    // marginTop: moderateScale(5),
    marginRight: moderateScale(5),
    paddingHorizontal: moderateScale(5),
  },
  promotionChipAdmin: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFA700',
    borderRadius: 5,
    height: scale(27),
    flex: 1,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: moderateScale(5),
    maxWidth: (getDeviceWidth - 20) / 2,
  },
  promoText: {
    fontSize: 12,
    color: COLOR.WHITE,
    fontFamily: FONT.NORMAL,
  },
});

export default RestaurantItem;
