import _ from 'lodash';
import React, {useEffect, useState, useContext, useCallback} from 'react';
import {StyleSheet, Text, TextInput, View, FlatList} from 'react-native';
import {COLOR, FONT, FONT_SIZE} from 'res/variables';
import RadioButton from 'toktokfood/components/RadioButton';
// Utils
import {moderateScale, scale, verticalScale} from 'toktokfood/helper/scale';
import {VerifyContext} from '.';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
export const Variations = ({basePrice, item}) => {
  const {
    totalPrice,
    setTotalPrice,
    optionsAmount,
    setOptionsAmount,
    count,
    selected,
    setSelected,
    requiredOptions,
    setRequiredOptions,
    notes,
    setNotes
  } = useContext(VerifyContext);

  useEffect(() => {
    if (optionsAmount) {
      setTotalPrice(count.quantity * (basePrice + optionsAmount));
    } else {
      setTotalPrice((prev) => {
        let amount = prev - (prev - basePrice);
        return count.quantity * amount;
      });
    }
  }, [optionsAmount]);

  useEffect(() => {
    if (Object.values(selected).length > 0) {
      let amount = 0;
      Object.values(selected).map((item) => {
        item.map((val) => {
          amount += val.addon_price;
        });
      });
      setOptionsAmount(amount);
    } else {
      setOptionsAmount(0);
    }
  }, [selected]);

  const onValueChange = useCallback(({item, options, index, temp}) => {
    let opt = {
      addon_id: parseInt(options.id),
      addon_name: options.optionName,
      addon_price: options.optionPrice,
    };
    let hasSelected = selected[item.optionName];
    if (hasSelected) {
      if (selected[item.optionName][index]) {
        if (selected[item.optionName].length > 1) {
          selected[item.optionName].splice(index, 1);
          setSelected((prev) => {
            return {...prev, [item.optionName]: selected[item.optionName]};
          });
        } else {
          delete selected[item.optionName];
          setSelected({...selected});
        }
      } else {
        if (selected[item.optionName].length != item.noOfSelection) {
          temp = [...selected[item.optionName], opt];
          setSelected((prev) => {
            return {...prev, [item.optionName]: temp};
          });
        } else {
          selected[item.optionName].splice(selected[item.optionName].length - 1, 1);
          temp = [...selected[item.optionName], opt];
          setSelected((prev) => {
            return {...prev, [item.optionName]: temp};
          });
        }
      }
    } else {
      temp = [...temp, opt];
      setSelected((prev) => {
        return {...prev, [item.optionName]: temp};
      });
    }
  }, [selected])

  const renderVariants = ({item}) => {
    let temp = [];
    if(!(requiredOptions[item.optionName]) && item.isRequired){
      setRequiredOptions(prev => { return { ...prev, [item.optionName]: item.isRequired }})
    }
    return (
      <>
        <View style={styles.variations}>
          <Text style={styles.variationTitle}>
            Choose your {item.optionName.toLowerCase()} (Pick {item.noOfSelection})
          </Text>
          <Text>{item.isRequired ? 'REQURED' : 'OPTIONAL'}</Text>
          {item.options.map((options, i) => {
            let index = -1;
            if (selected[item.optionName]) {
              index = selected[item.optionName].findIndex((v) => {
                return v.addon_id == options.id;
              });
            }
            return (
              <View style={styles.variationsWrapper}>
                <View style={styles.checkBoxWrapper}>
                  <RadioButton
                    onValueChange={(c) => {
                      onValueChange({item, options, index, temp});
                    }}
                    selected={index > -1}
                  />
                  <Text style={styles.checkBoxText}>{options.optionName}</Text>
                </View>
                <Text style={styles.variationPrice}>+ {options.optionPrice.toFixed(2)}</Text>
              </View>
            );
          })}
        </View>
      </>
    );
  };

  return (
    <>
      <FlatList data={item} renderItem={renderVariants} style={{flex: 1}}/>
      <View style={styles.variations}>
        <Text style={styles.variationTitle}>Special Instructions (Optional)</Text>
        <TextInput
          value={notes}
          multiline={true}
          numberOfLines={4}
          style={styles.input}
          placeholder="Type your instructions here..."
          placeholderTextColor={COLOR.MEDIUM}
          onChangeText={(notes) => setNotes(notes)}
        />
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
    // flex: 1,
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
