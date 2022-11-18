import React, {useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Image, TouchableHighlight, FlatList} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {useThrottle} from 'src/hooks';
import CONSTANTS from 'common/res/constants';
import {moderateScale} from 'toktokwallet/helper';

//SELF IMPORTS
import AdModal from './AdModal';

const {FONT_SIZE, COLOR, SIZE, FONT_FAMILY: FONT, MARGIN} = CONSTANTS;
const {width, height} = Dimensions.get('window');
const SCREEN_WIDTH = width;
const BANNER_WIDTH = SCREEN_WIDTH - MARGIN.M * 2;
// const BANNER_HEIGHT = BANNER_WIDTH / 2;
const BANNER_HEIGHT = width * 0.35;

const RenderItem = ({ad, index, bannerType, adsLength}) => {
  const [visible, setVisible] = useState(false);

  const onPress = () => setVisible(true);

  const onPressThrottled = useThrottle(onPress, 1000);

  return (
    <>
      <AdModal visible={visible} setVisible={setVisible} ad={ad} />
      <View
        style={[
          styles.adv,
          {
            ...(bannerType === '2'
              ? {width: width * 0.4, marginRight: moderateScale(adsLength - 1 !== index ? 16 : 32)}
              : {
                  width: adsLength === 1 ? width - 32 : width * 0.8,
                  marginRight: moderateScale(adsLength - 1 !== index ? 16 : 32),
                }),
          },
        ]}>
        <TouchableHighlight style={styles.touchable} underlayColor="transparent" onPress={onPressThrottled}>
          <View style={styles.imageBox}>
            <Image
              style={[
                styles.image,
                {
                  width: bannerType === '2' ? width * 0.4 : adsLength === 1 ? width - moderateScale(32) : width * 0.8,
                  height: bannerType === '2' ? BANNER_HEIGHT + 10 : BANNER_HEIGHT + (adsLength === 1 ? 20 : 10),
                },
              ]}
              source={{
                uri: bannerType === '2' ? ad.squareImage : ad.rectangleImage,
              }}
              resizeMode="stretch"
            />
          </View>
        </TouchableHighlight>
        {bannerType === '2' && (
          <View style={styles.textBox}>
            <Text style={styles.adTitle} numberOfLines={2}>
              {ad.title}
            </Text>
          </View>
        )}
      </View>
    </>
  );
};

const Slider = ({ads, bannerType}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <FlatList
      horizontal
      style={[
        styles.container,
        // {height: bannerType === '2' ? BANNER_HEIGHT + 35 : BANNER_HEIGHT + (ads.length === 1 ? 20 : 10)},
      ]}
      showsHorizontalScrollIndicator={false}
      data={ads}
      keyExtractor={item => item.id}
      renderItem={({item, index}) => (
        <RenderItem bannerType={bannerType} ad={item} index={index} adsLength={ads.length} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(16),
  },
  adv: {
    // height: moderateScale(BANNER_HEIGHT),
    // alignItems: 'center',
  },
  box: {
    paddingHorizontal: moderateScale(MARGIN.M / 2),
  },
  touchable: {
    borderRadius: moderateScale(SIZE.BORDER_RADIUS),
  },

  imageBox: {
    // backgroundColor: COLOR.WHITE,
    overflow: 'hidden',
  },
  image: {
    height: moderateScale(BANNER_HEIGHT),
    borderRadius: moderateScale(SIZE.BORDER_RADIUS),
    overflow: 'hidden',
  },
  textBox: {
    backgroundColor: COLOR.WHITE,
    marginTop: moderateScale(7),
    // flexWrap: 'wrap',
    // width: width * 0.4,
  },
  iconDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    color: COLOR.DARK,
    marginLeft: moderateScale(5),
  },
  adTitle: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
    textAlign: 'center',
    paddingHorizontal: moderateScale(10),
  },
});

export default Slider;
