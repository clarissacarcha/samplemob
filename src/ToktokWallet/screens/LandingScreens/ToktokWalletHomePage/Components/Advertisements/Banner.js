import React, {useRef, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableHighlight, Dimensions, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';
import CONSTANTS from 'common/res/constants'

const { FONT_SIZE, COLOR , SIZE , FONT_FAMILY: FONT, MARGIN} = CONSTANTS
const SCREEN_WIDTH = Dimensions.get('window').width;
const BANNER_WIDTH = SCREEN_WIDTH - MARGIN.M * 2;
const BANNER_HEIGHT = BANNER_WIDTH / 2;

const BannerAds = ({ads}) => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.push('SelectedAdvertisement', {advertisement: ads[0]});
  };

  const useThrottle = (cb, delayDuration) => {
    const options = {leading: true, trailing: false}; // add custom lodash options
    const cbRef = useRef(cb);
    // use mutable ref to make useCallback/throttle not depend on `cb` dep
    useEffect(() => {
      cbRef.current = cb;
    });
    return useCallback(
      throttle((...args) => cbRef.current(...args), delayDuration, options),
      [delayDuration],
    );
  };

  const onPressThrottled = useThrottle(onPress, 1000);

  if (!ads || ads.length === 0) return <View style={{height: MARGIN.M / 2}} />;

  return (
    <>
      <TouchableHighlight onPress={onPressThrottled} style={styles.touchable}>
        <Image
          style={{height: BANNER_HEIGHT, width: BANNER_WIDTH, borderRadius: 5}}
          source={{
            uri: ads[0].rectangleImage,
          }}
          resizeMode="cover"
        />
      </TouchableHighlight>
      <View style={styles.textBox}>
        <Text style={{fontFamily: FONT.BOLD}} numberOfLines={2}>
          {ads[0].title}
        </Text>
      </View>
    </>
  );
};

export default BannerAds;

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 5,
    margin: MARGIN.M,
    marginBottom: 0,
  },
  textBox: {
    height: 40,
    backgroundColor: COLOR.WHITE,
    marginHorizontal: MARGIN.M,
    marginBottom: MARGIN.M / 2,
  },
});
