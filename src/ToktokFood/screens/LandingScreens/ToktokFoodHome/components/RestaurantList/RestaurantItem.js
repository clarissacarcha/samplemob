import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// import CustomStarRating from 'toktokfood/components/CustomStarRating';

// Assets & Utils
import {moderateScale, scale, getDeviceWidth} from 'toktokfood/helper/scale';
import {time, no_image} from 'toktokfood/assets/images';

// Fonts, Colors & Images
import {COLOR, FONT, FONT_SIZE} from 'res/variables';

const RestaurantItem = ({item}) => {
  const navigation = useNavigation();
  const [validImg, setValidImg] = useState(true);

  const onRestaurantNavigate = () => {
    navigation.navigate('ToktokFoodRestaurantOverview', {item});
  };

  return (
    <TouchableOpacity onPress={() => onRestaurantNavigate(item)}>
      <Image
        style={styles.img}
        source={validImg ? {uri: item.logo, cache: 'default'} : no_image}
        resizeMode="cover"
        onError={() => setValidImg(false)}
      />
      <View style={styles.restaurantInfo}>
        <Text numberOfLines={1} style={styles.restaurantName}>{`${item.shopname} (${item.address})`}</Text>
        {/* <CustomStarRating
          rating={item.ratings ?? '0'}
          starImgStyle={{width: scale(15), height: scale(15), marginVertical: 5}}
          readOnly
        /> */}
        <View style={{marginVertical: 5}} />
        <View style={styles.branchInfo}>
          <Image resizeMode="contain" source={time} style={styles.timeImg} />
          <Text style={styles.branches}>{`${item.estimatedDeliveryTime} mins`}</Text>
          <MCIcon name="map-marker-outline" color={'#868686'} size={13} />
          <Text style={styles.branches}>
            {item.estimatedDistance.indexOf('KM') === -1 ? `${item.estimatedDistance} KM` : item.estimatedDistance}
          </Text>
        </View>

        {item.promoName && (
          <View style={{...styles.promoChip}}>
            <Text numberOfLines={1} style={styles.promoText}>
              {item.promoName}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
// , width: item?.promoName?.length <= 10 ? 100 : 180
const styles = StyleSheet.create({
  branchInfo: {
    flexDirection: 'row',
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
    alignSelf: 'flex-start',
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 30,
    height: scale(27),
    borderColor: '#FFA700',
    backgroundColor: '#FFE58A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(5),
  },
  promoText: {
    fontSize: 12,
    color: COLOR.BLACK,
    fontFamily: FONT.NORMAL,
  },
});

export default RestaurantItem;
