import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {moderateScale} from 'toktokbills/helper';
import {useNavigation} from '@react-navigation/native';
import {useThrottle} from 'src/hooks';
import FastImage from 'react-native-fast-image';

import {LoadingIndicator} from 'toktokbills/components';

import {SIZE} from 'src/res/variables';
import CONSTANTS from 'common/res/constants';
const {FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const OTCPartnerDetails = React.memo(({content, contentIndex, title}) => {
  const navigation = useNavigation();
  const [imageLoading, setImageLoading] = useState(false);

  const onPress = item => {
    navigation.navigate('ToktokWalletCashOutOTCTransaction', {otcPartnerDetails: item});
  };

  const onThrottledPress = useThrottle(item => onPress(item), 2000);

  return (
    <View style={{marginTop: moderateScale(20)}}>
      <Text style={{fontFamily: FONT.BOLD, marginHorizontal: moderateScale(16), marginBottom: moderateScale(10)}}>
        {title}
      </Text>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {content[title].map((item, index) => {
          return (
            <TouchableOpacity onPress={() => onThrottledPress(item)} style={styles.container} activeOpacity={0.8}>
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
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '33.33%',
    alignItems: 'center',
    marginVertical: SIZE.MARGIN / 2,
  },
  itemLogo: {
    height: moderateScale(60),
    width: moderateScale(60),
  },
  itemName: {
    fontFamily: FONT.REGULAR,
    fontSize: moderateScale(FONT_SIZE.M),
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
