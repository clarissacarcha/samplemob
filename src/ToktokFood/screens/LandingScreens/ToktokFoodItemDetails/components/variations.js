import React from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
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
              <BouncyCheckbox
                fillColor={COLOR.ORANGE}
                unfillColor="#FFFFFF"
                text={size.name}
                iconStyle={styles.checkBoxIcon}
                textStyle={styles.checkBoxText}
                onPress={(isChecked) => console.log(isChecked)}
              />
              <Text style={styles.variationPrice}>+{size.price}</Text>
            </View>
          ))}
        </View>
        <View style={styles.variations}>
          <Text style={styles.variationTitle}>Add ons (pick 1)</Text>
          {add_ons.map((ons) => (
            <View style={styles.variationsWrapper}>
              <BouncyCheckbox
                fillColor={COLOR.ORANGE}
                unfillColor="#FFFFFF"
                text={ons.name}
                iconStyle={styles.checkBoxIcon}
                textStyle={styles.checkBoxText}
                onPress={(isChecked) => console.log(isChecked)}
              />
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
        <FoodCart/>
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
  checkBoxText: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.REGULAR,
    textDecorationLine: 'none',
  },
  checkBoxIcon: {
    borderRadius: 10,
    marginStart: 0,
    borderColor: COLOR.MEDIUM,
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
