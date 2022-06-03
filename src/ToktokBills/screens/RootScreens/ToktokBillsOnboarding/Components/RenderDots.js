import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, FlatList, Dimensions, Animated, TouchableOpacity} from 'react-native';
import {VectorIcon, ICON_SET} from 'src/revamp';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

//HELPER
import {moderateScale, saveViewOnboarding, removeItemValue} from 'toktokbills/helper';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_SIZE, FONT_FAMILY: FONT} = CONSTANTS;
const {width} = Dimensions.get('window');

export const RenderDots = ({scrollX, data, sliderRef, dotPosition, setCurrentIndex, currentIndex}) => {
  const navigation = useNavigation();
  const {person} = useSelector(state => state.session.user);

  const onPressGotIt = async () => {
    // await removeItemValue();
    await saveViewOnboarding(person.id);
    navigation.replace('ToktokBillsHome');
  };

  return (
    <View style={styles.container}>
      <View style={styles.dotsContainer}>
        {data.map((d, index) => {
          const opacity = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          const dotSize = dotPosition.interpolate({
            // inputRange: [index - 1 * width, index * width, index * width + 1],
            inputRange: [index - 1, index, index + 1],
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });

          const dotColor = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: ['#F6841F', COLOR.ORANGE, '#F6841F'],
            extrapolate: 'clamp',
          });

          return (
            <>
              <Animated.View
                key={`dot-${index}`}
                opacity={opacity}
                style={[styles.dots, {backgroundColor: dotColor, width: dotSize}]}></Animated.View>
            </>
          );
        })}
      </View>
      {!(currentIndex < data.length - 1) && (
        <TouchableOpacity style={styles.btnContainer} onPress={onPressGotIt}>
          <Text style={styles.btnText}>Got it!</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
  },
  dotsContainer: {
    justifyContent: 'center',
    width: width,
    flexDirection: 'row',
  },
  nextPage: {
    flexDirection: 'row',
    marginHorizontal: 10,
    alignItems: 'center',
  },
  prevPage: {
    flexDirection: 'row',
    marginHorizontal: 10,
    alignItems: 'center',
  },
  dotsText: {
    fontFamily: FONT_SIZE.REGULAR,
    color: COLOR.ORANGE,
  },
  btnContainer: {
    marginTop: moderateScale(20),
    marginHorizontal: moderateScale(75),
    backgroundColor: COLOR.ORANGE,
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(5),
  },
  btnText: {
    color: COLOR.WHITE,
    fontFamily: FONT.BOLD,
    textAlign: 'center',
  },
  dots: {
    borderRadius: 100,
    marginHorizontal: 4,
    height: 10,
  },
});
