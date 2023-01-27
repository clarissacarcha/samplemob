import React, {useState} from 'react';
import {View, Text, Dimensions, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {moderateScale} from 'toktokbills/helper';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useThrottle} from 'src/hooks';
import FIcon5 from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import {no_profile_contact} from 'toktokwallet/assets';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const FavoriteDetails = ({item, index, onPressFavorite, onRefreshFavorite, onSelectItem}) => {
  const navigation = useNavigation();
  const [imageError, setImageError] = useState(false);
  const {favoriteAccount} = item.node;
  const {mobileNumber, person} = favoriteAccount;

  const onPress = () => {
    onSelectItem(item.node);
    return navigation.goBack();
  };

  const onThrottledPress = useThrottle(onPress, 2000);

  return (
    <TouchableOpacity onPress={onThrottledPress} style={styles.container}>
      <View style={{justifyContent: 'center'}}>
        <FastImage
          source={imageError ? no_profile_contact : {uri: person.selfieImage, priority: FastImage.priority.high}}
          style={styles.itemLogo}
          onError={() => setImageError(true)}
        />
      </View>
      <View style={styles.detailTwoContainer}>
        <View>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.descriptions}>
            {person.firstName} {person.lastName[0]}.
          </Text>
          <Text style={styles.subText}>{mobileNumber}</Text>
        </View>
      </View>
      <View style={{alignItems: 'flex-end'}}>
        <TouchableOpacity onPress={onPressFavorite} hitSlop={{left: 15, right: 15, bottom: 15, top: 15}}>
          <FIcon5 name={'heart'} color={COLOR.ORANGE} size={moderateScale(17)} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(18),
    paddingVertical: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailTwoContainer: {
    marginLeft: moderateScale(18),
    paddingVertical: moderateScale(4),
    flexShrink: 1,
    flex: 1,
  },
  subText: {
    color: '#525252',
    fontSize: FONT_SIZE.S,
  },
  descriptions: {
    width: moderateScale(199),
    color: '#525252',
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.BOLD,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLogo: {
    height: moderateScale(45),
    width: moderateScale(45),
    borderRadius: moderateScale(45),
    resizeMode: 'contain',
  },
  itemName: {
    fontFamily: FONT.REGULAR,
    fontSize: moderateScale(FONT_SIZE.M),
    flexShrink: 1,
    marginLeft: moderateScale(15),
  },
  loadingContainer: {
    position: 'absolute',
    right: 0,
    left: 0,
  },
  detailsContainer: {
    flexDirection: 'row',
  },
});
