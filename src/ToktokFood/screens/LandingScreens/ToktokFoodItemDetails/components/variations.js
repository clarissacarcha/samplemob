import React from 'react';
import CheckBox from '@react-native-community/checkbox';
import {View, Text, StyleSheet, FlatList, TextInput} from 'react-native';

import FoodCart from './FoodCart';

import {FONT, FONT_SIZE, COLOR} from 'res/variables';

// Utils
import {scale, verticalScale, moderateScale} from 'toktokfood/helper/scale';

const Variations = ({item}) => {
  const renderItem = (variations) => {
    const {id, sizes, add_ons} = variations.item;
    return (
      <>
        <View key={id} style={styles.variations}>
          <Text style={styles.variationTitle}>Choose your size (pick 1)</Text>
          {sizes.map((size) => (
            <View style={styles.variationsWrapper}>
              <View style={styles.checkBoxWrapper}>
                <CheckBox
                  style={styles.checkBox}
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
        <View key={id} style={styles.variations}>
          <Text style={styles.variationTitle}>Add ons (pick 1)</Text>
          {add_ons.map((ons) => (
            <View style={styles.variationsWrapper}>
              <View style={styles.checkBoxWrapper}>
                <CheckBox
                  style={styles.checkBox}
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
        <View key={id} style={styles.variations}>
          <Text style={styles.variationTitle}>Special Instructions (Optional)</Text>
          <View>
            <TextInput
              multiline={true}
              numberOfLines={4}
              style={styles.input}
              placeholder="Type your instructions here..."
              placeholderTextColor={COLOR.MEDIUM}
            />
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <FlatList data={item.variations} renderItem={renderItem} />
        <FoodCart item_price={item.price} />
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
  checkBox: {
    transform: Platform.OS === 'android' ? [{scaleX: 1}, {scaleY: 1}] : [{scaleX: 0.8}, {scaleY: 0.8}],
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
  input: {
    height: moderateScale(90),
    borderWidth: 1,
    borderRadius: 10,
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.REGULAR,
    borderColor: COLOR.MEDIUM,
    textAlignVertical: 'top',
    marginVertical: scale(6),
    paddingTop: 15,
    paddingHorizontal: scale(15),
  },
});
export default Variations;
