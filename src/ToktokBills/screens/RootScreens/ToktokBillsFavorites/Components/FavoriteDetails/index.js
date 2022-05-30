import React, {useState} from 'react';
import {View, Text, Dimensions, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {moderateScale} from 'toktokbills/helper';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useThrottle} from 'src/hooks';

import {LoadingIndicator} from 'toktokbills/components';
import { heart_fill_icon, heart_selected_fill_icon } from "src/ToktokLoad/assets/icons";
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SHADOW} = CONSTANTS;
const {width, height} = Dimensions.get('window');

export const FavoriteDetails = ({item, index}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [imageLoading, setImageLoading] = useState(true);

  const onPress = () => {
    navigation.navigate('ToktokBillsPaymentProcess', {
      billItemId: item.node.billItemId,
      billType: route.params.billTypes,
      favoriteDetails: {
        id: item.node.id,
        firstFieldValue: item.node.secondFieldValue,
        secondFieldValue: item.node.firstFieldValue,
      },
    });
  };

  const onThrottledPress = useThrottle(onPress, 2000);

  return (
    <TouchableOpacity onPress={onThrottledPress} style={styles.container}>
      <View style={styles.item}>
        <View style={{justifyContent: 'center'}}>
          {imageLoading && (
            <View style={{position: 'absolute', right: 0, left: 0}}>
              <LoadingIndicator isLoading={true} size="small" />
            </View>
          )}
          <Image
            source={{uri: item.node.billItem.logo}}
            style={styles.itemLogo}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
        </View>
        <View style={styles.detailTwoContainer}>
           <View>
            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.descriptions}>{item.node.billItem.descriptions}</Text>
             <Text style={styles.subText}>{item.node.secondFieldValue}</Text>
             <Text style={styles.subText}>{item.node.firstFieldValue}</Text>
           </View>
        </View>
        <View style={styles.detailTwoContainer}>
          <Image source={heart_fill_icon} style={styles.heartIcon} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  detailTwoContainer: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(5),
  },
  heartIcon: {
    width: moderateScale(18),
    height: moderateScale(16),
    resizeMode: "contain"
  },
  subText: {
    color: '#525252',
    fontSize: FONT_SIZE.S,
  },
  descriptions:{
    width: moderateScale(199),
    color: "#525252",
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.BOLD,
  },
  item: {
    justifyContent: "space-between",
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLogo: {
    height: moderateScale(50),
    width: moderateScale(80),
    resizeMode: 'contain',
  },
});
