import { useNavigation } from '@react-navigation/native';
import React, {useState} from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomStarRating from 'toktokfood/components/CustomStarRating';
import { scale, getDeviceWidth } from 'toktokfood/helper/scale';
import { time, no_image } from 'toktokfood/assets/images';

// Fonts, Colors & Images
import {COLOR, FONT, FONT_SIZE} from 'res/variables';

const RestaurantItem = ({ item }) => {

  const navigation = useNavigation();
  const [validImg, setValidImg] = useState(true);

  const onRestaurantNavigate = (item) => {
    navigation.navigate('ToktokFoodRestaurantOverview', {item});
  };
 
  return (
    <TouchableOpacity onPress={() => onRestaurantNavigate(item)} style={styles.restaurantList}>
      <Image
        style={styles.img}
        source={validImg ? { uri: item.logo, cache: 'default' } : no_image}
        resizeMode="cover"
        onError={() => setValidImg(false)}
      />
      <View style={styles.restaurantInfo}>
        <Text numberOfLines={1} style={styles.restaurantName}>{`${item.shopname} (${item.address})`}</Text>
        <CustomStarRating
          rating={item.ratings ?? '0'}
          starImgStyle={{ width: scale(15), height: scale(15), marginVertical: 5 }}
          readOnly
        />
        <View style={styles.branchInfo}>
          <Image resizeMode="contain" source={time} style={styles.timeImg} />
          <Text style={styles.branches}>{`${item.estimatedDeliveryTime} mins`}</Text>
          <MCIcon name="map-marker-outline" color={'#868686'} size={13} />
          <Text style={styles.branches}>{item.estimatedDistance} KM</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

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
    },
    restaurantList: {
      width: (getDeviceWidth - 20) / 2
    },
    restaurantName: {
      fontSize: FONT_SIZE.M,
      fontFamily: FONT.BOLD
    },
    timeImg: {
      width: scale(13),
      height: scale(13),
      tintColor: COLOR.DARK,
      resizeMode: 'contain'
    },
  });
  
export default RestaurantItem;
