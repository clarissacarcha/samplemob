import React from 'react';
import CheckBox from '@react-native-community/checkbox';
import {View, Text, StyleSheet, FlatList} from 'react-native';

import FoodCart from 'toktokfood/components/FoodCart';

import {FONT, FONT_SIZE, COLOR} from 'res/variables';

// Utils
import {scale, verticalScale} from 'toktokfood/helper/scale';

const Variations = ({item}) => {

  const renderItem = (variations) => {
    const {sizes, add_ons} = variations.item;
    return (
      <>
        <View style={styles.variations}>
          <Text style={styles.variationTitle}>Choose your size (pick 1)</Text>
          {sizes.map((size) => (
            <View style={styles.variationsWrapper}>
              <View style={styles.checkBoxWrapper}>
                <CheckBox
                  style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}
                  lineWidth={2}
                  boxType="square"
                  onCheckColor={COLOR.WHITE}
                  onTintColor={COLOR.ORANGE}
                  onFillColor={COLOR.ORANGE}
                  animationDuration={0.2}
                  tintColors={{true: COLOR.ORANGE, false: COLOR.MEDIUM}}
                  onValueChange={(newValue) => console.log(newValue)}
                />
                <Text style={styles.checkBoxText}>{size.name}</Text>
              </View>
              <Text style={styles.variationPrice}>+{size.price}</Text>
            </View>
          ))}
        </View>
        <View style={styles.variations}>
          <Text style={styles.variationTitle}>Add ons (pick 1)</Text>
          {add_ons.map((ons) => (
            <View style={styles.variationsWrapper}>
              <View style={styles.checkBoxWrapper}>
                <CheckBox
                  style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}
                  lineWidth={2}
                  boxType="square"
                  onCheckColor={COLOR.WHITE}
                  onTintColor={COLOR.ORANGE}
                  onFillColor={COLOR.ORANGE}
                  animationDuration={0.2}
                  tintColors={{true: COLOR.ORANGE, false: COLOR.MEDIUM}}
                  onValueChange={(newValue) => console.log(newValue)}
                />
                <Text style={styles.checkBoxText}>{ons.name}</Text>
              </View>
              <Text style={styles.variationPrice}>+{ons.price}</Text>
            </View>
          ))}
        </View>
      </>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <FlatList data={item.variations} renderItem={renderItem} />
        <FoodCart />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  variations: {
    flex: 1,
    paddingBottom: 10,
    borderBottomWidth: 8,
    borderBottomColor: COLOR.LIGHT,
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(12),
  },
  variationsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(6),
  },
  checkBoxWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBoxText: {
    marginLeft: 8,
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.REGULAR,
    textDecorationLine: 'none',
  },
  variationTitle: {
    marginBottom: 8,
    color: COLOR.BLACK,
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
  },
  variationPrice: {
    color: COLOR.BLACK,
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.L,
  },
});
export default Variations;
