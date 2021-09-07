import _ from 'lodash';
import React, {useEffect, useState, useReducer} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {COLOR, FONT, FONT_SIZE} from 'res/variables';
import RadioButton from 'toktokfood/components/RadioButton';
// Utils
import {moderateScale, scale, verticalScale} from 'toktokfood/helper/scale';

import reducer from './reducer';

const Variations = ({item, onVariationChange, onAddOnsChange}) => {
  const initialState = {
    variants: [],
    addOns: [],
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState(null);
  const [lastSelected, setLastSelected] = useState({id: '', value: 0.0, lastValue: 0.0});

  useEffect(() => {
    // onVariationChange({value: lastSelected.value, lastValue: lastSelected.lastValue});
    // console.log({value: lastSelected.value, lastValue: lastSelected.lastValue});

    // console.log(JSON.stringify(state));
  }, [state]);

  const FoodVariations = (props) => {
    const {id, name, maxSelection, variants} = props;
    return (
      <>
        <View key={id} style={styles.variations}>
          <Text style={styles.variationTitle}>
            Choose your {name.toLowerCase()} (Pick {maxSelection})
          </Text>
          {variants.map((v) => (
            <View style={styles.variationsWrapper}>
              <View style={styles.checkBoxWrapper}>
                <RadioButton
                  onValueChange={(s) => {
                    dispatch({type: 'UPDATE_VARIANTS', payload: v});
                    // setLastSelected({
                    //   id: v.id,
                    //   value: v.optionPrice,
                    //   lastValue: lastSelected.id !== '' ? lastSelected.value : v.optionPrice,
                    // });
                  }}
                  selected={lastSelected.id === v.id}
                />
                <Text style={styles.checkBoxText}>{v.optionName}</Text>
              </View>
              <Text style={styles.variationPrice}>+ {v.optionPrice.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </>
    );
  };

  const FoodAddOns = (props) => {
    const {id, name, maxSelection, variants} = props;
    return (
      <>
        <View key={id} style={styles.variations}>
          <Text style={styles.variationTitle}>
            Choose your {name.toLowerCase()} (Pick {maxSelection})
          </Text>
          {variants.map((v) => (
            <View style={styles.variationsWrapper}>
              <View style={styles.checkBoxWrapper}>
                <RadioButton
                  onValueChange={() => {
                    setLastSelected({
                      id: v.id,
                      value: v.optionPrice,
                      lastValue: lastSelected.id !== '' ? lastSelected.value : v.optionPrice,
                    });
                  }}
                  selected={lastSelected.id === v.id}
                />
                <Text style={styles.checkBoxText}>{v.optionName}</Text>
              </View>
              <Text style={styles.variationPrice}>+ {v.optionPrice.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </>
    );
  };

  return (
    <>
      <View style={styles.container}>
        {_.map(item, (v) => {
          const {id, optionName, isRequired, noOfSelection, options} = v;
          return optionName !== 'Add-ons' ? (
            <FoodVariations
              id={id}
              name={optionName}
              variants={options}
              required={isRequired}
              maxSelection={noOfSelection}
            />
          ) : (
            <FoodAddOns
              id={id}
              name={optionName}
              variants={options}
              required={isRequired}
              maxSelection={noOfSelection}
            />
          );
        })}
        <View style={styles.variations}>
          <Text style={styles.variationTitle}>Special Instructions (Optional)</Text>
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
    paddingVertical: verticalScale(10),
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
