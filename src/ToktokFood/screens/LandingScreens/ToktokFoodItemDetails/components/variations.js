import React, {useEffect, useState} from 'react';
import CheckBox from '@react-native-community/checkbox';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';

import RadioButton from 'toktokfood/components/RadioButton';

import {FONT, FONT_SIZE, COLOR} from 'res/variables';

// Utils
import {scale, verticalScale, moderateScale} from 'toktokfood/helper/scale';

const Variations = ({item, onVariationChange, onAddOnsChange}) => {

  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState(null);
  const [lastSelected, setLastSelected] = useState({id: '', value: 0.0, lastValue: 0.0});

  useEffect(() => {
    // onVariationChange({value: lastSelected.value, lastValue: lastSelected.lastValue});
    // console.log({value: lastSelected.value, lastValue: lastSelected.lastValue});
  }, [lastSelected]);

  const RenderItem = (props) => {
    const {id, sizes, add_ons} = props.variations;
    return (
      <>
        <View key={id} style={styles.variations}>
          <Text style={styles.variationTitle}>Choose your size (Pick 1)</Text>
          {sizes.map((size) => (
            <View style={styles.variationsWrapper}>
              <View style={styles.checkBoxWrapper}>
                {/* <CheckBox
                  lineWidth={2}
                  boxType="square"
                  animationDuration={0.2}
                  style={styles.checkBox}
                  onCheckColor={COLOR.ORANGE}
                  onTintColor={COLOR.ORANGE}
                  onFillColor={COLOR.ORANGE}
                  value={selectedVariations === size.id}
                  tintColors={{true: COLOR.ORANGE, false: COLOR.MEDIUM}}
                  onValueChange={(isChecked) => {
                    if (isChecked) {
                      if (lastSelected !== null) setLastSelected(size.price);
                      setSelectedVariations(isChecked ? size.id : null);
                      onVariationChange(isChecked ? size.price : lastSelected - size.price);
                    }
                  }}
                /> */}
                <RadioButton
                  onValueChange={() => {
                    setLastSelected({
                      id: size.id,
                      value: size.price,
                      lastValue: lastSelected.id !== '' ? lastSelected.value : size.price,
                    });
                  }}
                  selected={lastSelected.id === size.id}
                />
                <Text style={styles.checkBoxText}>{size.name}</Text>
              </View>
              <Text style={styles.variationPrice}>+ {size.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>
        <View key={id} style={styles.variations}>
          <Text style={styles.variationTitle}>Add ons</Text>
          {add_ons.map((ons) => (
            <View style={styles.variationsWrapper}>
              <View style={styles.checkBoxWrapper}>
                <CheckBox
                  style={styles.checkBox}
                  lineWidth={2}
                  boxType="square"
                  onCheckColor={COLOR.ORANGE}
                  onTintColor={COLOR.ORANGE}
                  onFillColor={COLOR.ORANGE}
                  animationDuration={0.2}
                  value={selectedAddOns.includes(ons.id)}
                  tintColors={{true: COLOR.ORANGE, false: COLOR.MEDIUM}}
                  onValueChange={(isChecked) => {
                    const ids = selectedAddOns;
                    isChecked ? ids.push(ons.id) : ids.splice(selectedAddOns.indexOf(ons.id), 1);
                    setSelectedAddOns(ids);
                    onAddOnsChange(isChecked ? ons.price : -ons.price);
                  }}
                />
                <Text style={styles.checkBoxText}>{ons.name}</Text>
              </View>
              <Text style={styles.variationPrice}>+ {ons.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>
        <View key={id} style={styles.variations}>
          <Text style={styles.variationTitle}>Special Instructions (Optional)</Text>
          <TextInput
            multiline={true}
            numberOfLines={4}
            style={styles.input}
            placeholder="Type your instructions here..."
            placeholderTextColor={COLOR.MEDIUM}
          />
        </View>
      </>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <RenderItem variations={item.variations[0]} />
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
    fontFamily: FONT.BOLD,
    fontSize: 17,
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
