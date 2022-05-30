import React, {useState} from 'react';
import {View, Text, Dimensions, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {moderateScale} from 'toktokbills/helper';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useThrottle} from 'src/hooks';

import {LoadingIndicator} from 'toktokbills/components';
import {heart_fill_icon, heart_selected_fill_icon} from 'src/ToktokLoad/assets/icons';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SHADOW} = CONSTANTS;
const {width, height} = Dimensions.get('window');

export const FavoriteDetails = ({item, index, onPressFavorite, onRefreshFavorite}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [imageLoading, setImageLoading] = useState(true);
  const {billItemId, billItem, id, firstFieldValue, secondFieldValue} = item.node;
  const {descriptions, logo, billType} = billItem;

  const onPress = () => {
    navigation.navigate('ToktokBillsPaymentProcess', {
      billItemId: billItemId,
      billType: billItem.billType,
      favoriteDetails: {
        id: id,
        firstFieldValue: firstFieldValue,
        secondFieldValue: secondFieldValue,
      },
      onRefreshFavorite,
    });
  };

  const onThrottledPress = useThrottle(onPress, 2000);

  return (
    <TouchableOpacity onPress={onThrottledPress} style={styles.container}>
      <View style={styles.item}>
        <View style={{justifyContent: 'center'}}>
          {imageLoading && (
            <View style={styles.loadingContainer}>
              <LoadingIndicator isLoading={true} size="small" />
            </View>
          )}
          <Image
            source={{uri: billItem.logo}}
            style={styles.itemLogo}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
        </View>
        <View style={styles.detailTwoContainer}>
          <View>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.descriptions}>
              {billItem.descriptions}
            </Text>
            <Text style={styles.subText}>{secondFieldValue}</Text>
            <Text style={styles.subText}>{firstFieldValue}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onPressFavorite}>
          <View style={styles.detailTwoContainer}>
            <Image source={heart_fill_icon} style={styles.heartIcon} />
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: moderateScale(5),
  },
  detailTwoContainer: {
    marginLeft: moderateScale(18),
    paddingVertical: moderateScale(4),
  },
  heartIcon: {
    width: moderateScale(18),
    height: moderateScale(16),
    resizeMode: 'contain',
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
    marginHorizontal: moderateScale(20),
  },
  itemLogo: {
    height: moderateScale(60),
    width: moderateScale(80),
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
});
