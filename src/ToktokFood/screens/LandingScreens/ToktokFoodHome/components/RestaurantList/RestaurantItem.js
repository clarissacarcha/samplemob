import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// import CustomStarRating from 'toktokfood/components/CustomStarRating';

// Assets & Utils
import {moderateScale, scale, getDeviceWidth} from 'toktokfood/helper/scale';
import {time, no_image} from 'toktokfood/assets/images';

// Fonts, Colors & Images
import {COLOR, FONT, FONT_SIZE} from 'res/variables';

const RestaurantItem = ({activeTab, item}) => {
  const navigation = useNavigation();
  const [validImg, setValidImg] = useState(true);
  const {id} = activeTab;

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

  return (
    <View>
      <TouchableOpacity onPress={() => onRestaurantNavigate(item)}>
        <Image
          style={styles.img}
          source={validImg ? {uri: item.logo, cache: 'default'} : no_image}
          resizeMode="cover"
          onError={() => setValidImg(false)}
        />
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
    width: '90%',
    height: 150,
    borderRadius: 10,
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
    backgroundColor: '#FFA700',
    borderRadius: 5,
    height: scale(27),
    justifyContent: 'center',
    // marginTop: moderateScale(5),
    marginRight: moderateScale(5),
    paddingHorizontal: moderateScale(5),
  },
  promoText: {
    fontSize: 12,
    color: COLOR.WHITE,
    fontFamily: FONT.NORMAL,
  },
});

export default RestaurantItem;
