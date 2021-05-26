import React, {useRef, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, Dimensions, Image, TouchableHighlight, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';
import {FONT, FONT_SIZE, COLOR, SIZE} from '../../../../../../res/variables';
import {VectorIcon, ICON_SET} from '../../../../../../revamp';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BANNER_WIDTH = SCREEN_WIDTH - SIZE.MARGIN * 3;
const BANNER_HEIGHT = BANNER_WIDTH / 2;

const GridAd = ({ad}) => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.push('SelectedAdvertisement', {advertisement: ad});
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

  return (
    <View style={{margin: SIZE.MARGIN / 2, width: BANNER_HEIGHT}}>
      <TouchableHighlight style={styles.touchable} onPress={onPressThrottled}>
        <View>
          <View style={styles.imageBox}>
            <Image
              style={styles.image}
              source={{
                uri: ad.squareImage,
              }}
              resizeMode="cover"
            />
          </View>
        </View>
      </TouchableHighlight>
      <View style={styles.textBox}>
        <Text style={{fontFamily: FONT.BOLD}} numberOfLines={2}>
          {ad.title}
        </Text>
      </View>
    </View>
  );
};

const BannerAds = ({ads}) => {
  return (
    <View style={styles.box}>
      <FlatList
        data={ads}
        renderItem={({item, index}) => <GridAd ad={item} />}
        showsVerticalScrollIndicator={false}
        numColumns={2}
      />
    </View>
  );
};

export default BannerAds;

const styles = StyleSheet.create({
  box: {
    paddingHorizontal: SIZE.MARGIN / 2,
  },
  touchable: {
    borderRadius: SIZE.BORDER_RADIUS,
  },

  imageBox: {
    // backgroundColor: COLOR.WHITE,
  },
  image: {
    height: BANNER_HEIGHT,
    width: BANNER_HEIGHT,
    borderRadius: SIZE.BORDER_RADIUS,
    overflow: 'hidden',
  },
  textBox: {
    height: 40,
    backgroundColor: COLOR.WHITE,
  },
  iconDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {color: COLOR.DARK, marginLeft: 5},
});
