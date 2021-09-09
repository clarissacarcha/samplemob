import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {COLOR, FONT, FONT_SIZE} from 'res/variables';
import RadioButton from 'toktokfood/components/RadioButton';
// Utils
import {moderateScale, scale, verticalScale} from 'toktokfood/helper/scale';

const Variations = ({item, onVariationChange, onAddOnsChange}) => {
  const [vars, setVariants] = useState([]);
  const [addOns, setAddOns] = useState([]);

  const [selected, setSelected] = useState([]);

  const [d, dd] = useState();

  const itemChecker = (collection = [], payload = {}, action = '', cb) => {
    if (!_.find(collection, {id: payload.id})) {
      collection.push(payload);
      if (action === 'variants') {
        cb(collection);
      } else {
        cb(collection);
      }
    }
  };

  const counter = ({collection = [], action = '', payload = {}}) => {
    if (action === 'UPDATE_VARIANTS') {
      itemChecker(collection, payload, 'variants', (v) => setVariants(v));
    }
    if (action === 'UPDATE_ADD_ONS') {
      itemChecker(collection, payload, 'addOns', (v) => setAddOns(v));
    }
  };

  const updatedSelectedOption = (id) => {
    const curentSelected = selected;
    curentSelected.push(id);
    setSelected(curentSelected);
  };

  const isVariantChecked = (id) => {
    return _.find(vars, {id: id});
  };

  const isAddOnCheked = (id) => {
    return _.find(addOns, {id: id});
  };

  const itemCalculator = () => {
    const total = _(addOns)
      .groupBy('id')
      .map((objs, key) => ({
        total: _.sumBy(objs, 'optionPrice'),
      }))
      .value();
    console.log(total);
    const sum = _.reduce(total, (acc, n) => {
      return acc.total + n.total;
    });
    console.log(sum);
  };

  useEffect(() => {
    // itemCalculator();
    console.log(selected);
  }, [selected]);

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
                  onValueChange={(c) => {
                    counter({collection: vars, action: 'UPDATE_VARIANTS', payload: v});
                    dd(v.id);
                  }}
                  selected={d === v.id}
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
    const {id, name, maxSelection, ons} = props;
    return (
      <>
        <View key={id} style={styles.variations}>
          <Text style={styles.variationTitle}>
            Choose your {name.toLowerCase()} (Pick {maxSelection})
          </Text>
          {ons.map((v) => (
            <View style={styles.variationsWrapper}>
              <View style={styles.checkBoxWrapper}>
                <RadioButton
                  onValueChange={(c) => {
                    counter({collection: addOns, action: 'UPDATE_ADD_ONS', payload: v});
                    dd(v.id);
                  }}
                  selected={d ===v.id}
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
          if (optionName.toLowerCase().indexOf('ons') === -1) {
            return (
              <FoodVariations
                id={id}
                name={optionName}
                variants={options}
                required={isRequired}
                maxSelection={noOfSelection}
              />
            );
          } else {
            return (
              <FoodAddOns id={id} name={optionName} ons={options} required={isRequired} maxSelection={noOfSelection} />
            );
          }
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
