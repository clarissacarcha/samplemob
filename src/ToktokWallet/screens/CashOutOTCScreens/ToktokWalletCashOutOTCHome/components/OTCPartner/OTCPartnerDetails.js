import React, {useState} from 'react';
import {View, Text, Dimensions, StyleSheet, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import {moderateScale} from 'toktokbills/helper';
import {useNavigation} from '@react-navigation/native';
import {useThrottle} from 'src/hooks';
import FastImage from 'react-native-fast-image';

import {LoadingIndicator} from 'toktokbills/components';

import {SIZE} from 'src/res/variables';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SHADOW} = CONSTANTS;
const {width, height} = Dimensions.get('window');

export const OTCPartnerDetails = React.memo(({item, index}) => {
  const navigation = useNavigation();
  const [imageLoading, setImageLoading] = useState(false);

  const onPress = () => {
    navigation.navigate('ToktokWalletCashOutOTCTransaction', {otcPartnerDetails: item});
  };

  const onThrottledPress = useThrottle(onPress, 2000);

  return (
    <TouchableOpacity onPress={onThrottledPress} style={styles.container} activeOpacity={0.8}>
      <View style={styles.item}>
        <View style={{justifyContent: 'center'}}>
          {imageLoading && (
            <View style={styles.loadingContainer}>
              <LoadingIndicator isLoading={true} size="small" />
            </View>
          )}
          <FastImage
            source={{uri: item?.logo}}
            style={styles.itemLogo}
            resizeMode={FastImage.resizeMode.contain}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
        </View>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SIZE.MARGIN / 2,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  itemLogo: {
    height: moderateScale(35),
    width: moderateScale(35),
  },
  itemName: {
    fontFamily: FONT.REGULAR,
    fontSize: moderateScale(FONT_SIZE.S),
    textAlign: 'center',
    marginTop: moderateScale(5),
    marginHorizontal: moderateScale(5),
  },
  loadingContainer: {
    position: 'absolute',
    right: 0,
    left: 0,
  },
});
