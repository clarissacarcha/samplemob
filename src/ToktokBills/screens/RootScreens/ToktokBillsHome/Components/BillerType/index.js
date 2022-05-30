import React, {useState} from 'react';
import {View, Text, Dimensions, StyleSheet, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import {moderateScale} from 'toktokbills/helper';
import {useNavigation} from '@react-navigation/native';
import {useThrottle} from 'src/hooks';

import {LoadingIndicator} from 'toktokbills/components';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SHADOW} = CONSTANTS;
const {width, height} = Dimensions.get('window');

export const BillerType = ({item, index}) => {
  const navigation = useNavigation();
  const [imageLoading, setImageLoading] = useState(true);

  const onPress = () => {
    navigation.navigate('ToktokBiller', {billType: item});
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
          <Image
            source={{uri: item.icon}}
            style={styles.itemLogo}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
        </View>
        <Text style={styles.itemName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: width / 4,
    width: width / 4 - moderateScale(10),
    justifyContent: 'center',
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
    fontSize: moderateScale(FONT_SIZE.M),
    textAlign: 'center',
    marginTop: moderateScale(5),
    marginHorizontal: moderateScale(7),
  },
  loadingContainer: {
    position: 'absolute',
    right: 0,
    left: 0,
  },
});
