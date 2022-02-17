/* eslint-disable react-hooks/exhaustive-deps */
import _ from 'lodash';
import React, {useEffect, useState, useContext, useCallback} from 'react';
import {StyleSheet, Platform, Text, TextInput, View, TouchableOpacity} from 'react-native';
import {COLOR, FONT, FONT_SIZE} from 'res/variables';
import RadioButton from 'toktokfood/components/RadioButton';
// Utils
import {moderateScale, scale, verticalScale} from 'toktokfood/helper/scale';
import {VerifyContext} from './VerifyContextProvider';
// import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import Separator from 'toktokfood/components/Separator';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
export const Variations = ({data, productId}) => {
  const {
    // totalPrice,
    // productDetails,
    setTotalPrice,
    optionsAmount,
    setOptionsAmount,
    count,
    setCount,
    selected,
    setSelected,
    requiredOptions,
    setRequiredOptions,
    notes,
    setNotes,
    selectedVariants,
    setSelectedVariants,
    basePrice,
  } = useContext(VerifyContext);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dataOptions, setDataOptions] = useState([]);

  useEffect(() => {
    if (Object.keys(data).length > 0 && data?.variants.length > 0) {
      let selectedVar = productId
        ? data.variants.find(val => {
            return productId == val.Id;
          })
        : data.variants[0];
      setSelectedVariants(selectedVar);
    }
  }, [data.variants]);

  useEffect(() => {
    if (Object.keys(data).length && data?.options.length) {
      let temp = [];
      data.options.map(opt => {
        const d = {
          ...opt,
          isCollapsed: false,
        };
        temp.push(d);
      });
      setDataOptions(temp);
    }
  }, [data]);

  useEffect(() => {
    if (optionsAmount) {
      setTotalPrice(count.quantity * (basePrice + optionsAmount));
    } else {
      setTotalPrice(prev => {
        let amount = prev - (prev - basePrice);
        return count.quantity * amount;
      });
    }
  }, [optionsAmount, basePrice]);

  useEffect(() => {
    if (Object.values(selected).length > 0) {
      let amount = 0;
      Object.values(selected).map(item => {
        item.map(val => {
          amount += val.addon_price;
        });
      });
      setOptionsAmount(amount);
    } else {
      setOptionsAmount(0);
    }
  }, [selected]);

  const onValueChange = useCallback(
    ({item, optionLogs, index, temp}) => {
      let opt = {
        addon_id: parseInt(optionLogs.id),
        addon_name: optionLogs.optionName,
        addon_price: optionLogs.optionPrice,
      };
      let hasSelected = selected[item.optionName];
      if (hasSelected) {
        if (selected[item.optionName][index]) {
          if (selected[item.optionName].length > 1) {
            selected[item.optionName].splice(index, 1);
            setSelected(prev => {
              return {...prev, [item.optionName]: selected[item.optionName]};
            });
          } else {
            const {[item.optionName]: val, ...data} = selected;
            setSelected(data);
          }
        } else {
          if (selected[item.optionName].length != item.noOfSelection) {
            temp = [...selected[item.optionName], opt];
            setSelected(prev => {
              return {...prev, [item.optionName]: temp};
            });
          } else {
            selected[item.optionName].splice(selected[item.optionName].length - 1, 1);
            temp = [...selected[item.optionName], opt];
            setSelected(prev => {
              return {...prev, [item.optionName]: temp};
            });
          }
        }
      } else {
        temp = [...temp, opt];
        setSelected(prev => {
          return {...prev, [item.optionName]: temp};
        });
      }
    },
    [selected],
  );

  const onToggleItems = useCallback(
    index => {
      const updatedData = dataOptions.map((dataOpt, i) => {
        if (index === i) {
          return {...dataOpt, isCollapsed: !dataOpt.isCollapsed};
        }
        return dataOpt;
      });
      setDataOptions(updatedData);
    },
    [dataOptions],
  );

  const Options = () => {
    return (
      <React.Fragment>
        {data.options?.length > 0 &&
          data.options.map((item, index) => {
            if (item.optionLogs.length > 0) {
              let temp = [];
              let dataSource = [];
              let remaining = [];

              if (item.optionLogs.length > 5) {
                dataSource = item.optionLogs.slice(0, 5);
                remaining = item.optionLogs.slice(4, -1);
              } else {
                dataSource = item.optionLogs;
              }

              if (!requiredOptions[item.optionName] && item.isRequired) {
                setRequiredOptions(prev => {
                  return {...prev, [item.optionName]: item.isRequired};
                });
              }

              const listData =
                dataOptions.length > 0 ? (dataOptions[index]?.isCollapsed ? item.optionLogs : dataSource) : [];

              const variantNote = i => {
                const {isRequired, noOfSelection, optionName} = i;
                // Required ; 1 option - select 1
                if (isRequired && noOfSelection === 1) {
                  return (
                    <Text style={styles.variationTitle}>
                      {optionName.toLowerCase()} (Select {item.noOfSelection})
                    </Text>
                  );
                }
                // Required ; multiple - select up to (n)
                if (isRequired && noOfSelection > 1) {
                  return (
                    <Text style={styles.variationTitle}>
                      {optionName.toLowerCase()} (Select up to {item.noOfSelection})
                    </Text>
                  );
                }
                // Optional  ; 1 option -  select 1
                if (!isRequired && noOfSelection === 1) {
                  return (
                    <Text style={styles.variationTitle}>
                      {optionName.toLowerCase()} (Select {item.noOfSelection})
                    </Text>
                  );
                }
                // Optional ; multiple - select up to (n)
                if (!isRequired && noOfSelection > 1) {
                  return (
                    <Text style={styles.variationTitle}>
                      {optionName.toLowerCase()} (Select up to {item.noOfSelection})
                    </Text>
                  );
                }
              };
              return (
                <View style={styles.variations}>
                  <View style={styles.flexCenter}>
                    {variantNote(item)}
                    <View style={styles.requiredContainer}>
                      <Text style={styles.requiredText}>{item.isRequired ? 'Required' : 'Optional'}</Text>
                    </View>
                  </View>
                  {listData.map(optionLogs => {
                    let index = -1;
                    if (selected[item.optionName]) {
                      index = selected[item.optionName].findIndex(v => {
                        return v.addon_id == optionLogs.id;
                      });
                    }
                    return (
                      <View style={styles.variationsWrapper}>
                        <RadioButton
                          isMultiple={item.noOfSelection > 1}
                          onValueChange={c => {
                            onValueChange({item, optionLogs, index, temp});
                          }}
                          name={optionLogs.optionName}
                          selected={index > -1}
                        />
                        <Text style={styles.variationPrice}>+ {optionLogs.optionPrice.toFixed(2)}</Text>
                      </View>
                    );
                  })}

                  {item.optionLogs?.length > 5 && (
                    <TouchableOpacity onPress={() => onToggleItems(index)} activeOpacity={0.9} style={styles.showMore}>
                      <Text style={styles.showMoreText}>
                        {dataOptions.length > 0 && dataOptions[index].isCollapsed
                          ? `Hide ${remaining.length > 1 ? 'Items' : 'Item'}`
                          : // : `(${remaining.length}) More ${remaining.length > 1 ? 'items' : 'item'}`}
                            'Show More'}
                      </Text>
                      <FA5Icon
                        name={
                          dataOptions?.length > 0
                            ? dataOptions[index].isCollapsed
                              ? 'chevron-up'
                              : 'chevron-down'
                            : ''
                        }
                        size={12}
                        color={'#FFA700'}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              );
            }

            return null;
          })}

        {/* <FlatList
          data={listData}
          renderItem={({item: optionLogs}) => {
            let index = -1;
            if (selected[item.optionName]) {
              index = selected[item.optionName].findIndex(v => {
                return v.addon_id == optionLogs.id;
              });
            }
            return (
              <View style={styles.variationsWrapper}>
                <RadioButton
                  isMultiple={item.noOfSelection > 1}
                  onValueChange={c => {
                    onValueChange({item, optionLogs, index, temp});
                  }}
                  name={optionLogs.optionName}
                  selected={index > -1}
                />
                <Text style={styles.variationPrice}>+ {optionLogs.optionPrice.toFixed(2)}</Text>
              </View>
            );
          }}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            item.optionLogs.length > 5 && (
              <TouchableOpacity onPress={() => onToggleItems(index)} activeOpacity={0.9} style={styles.showMore}>
                <Text style={{marginRight: moderateScale(12), color: '#FFA700'}}>
                  {dataOptions.length > 0 && dataOptions[index].isCollapsed
                    ? `Hide ${remaining.length > 1 ? 'Items' : 'Item'}`
                    : // : `(${remaining.length}) More ${remaining.length > 1 ? 'items' : 'item'}`}
                      'Show More'}
                </Text>
                <FA5Icon
                  name={dataOptions.length > 0 ? (dataOptions[index].isCollapsed ? 'chevron-up' : 'chevron-down') : ''}
                  size={12}
                  color={'#FFA700'}
                />
              </TouchableOpacity>
            )
          }
        /> */}
      </React.Fragment>
    );
  };

  const Variant = ({item}) => {
    return (
      <View style={styles.variantWrapper}>
        <View style={styles.variantSubWrapper}>
          <RadioButton
            onValueChange={c => {
              setSelectedVariants(item);
              setCount({type: 'ADD', quantity: 1});
            }}
            name={item.itemname}
            selected={item.Id == selectedVariants?.Id}
          />
        </View>
        <Text style={styles.variationPrice}>PHP {item.price.toFixed(2)}</Text>
      </View>
    );
  };

  const VariantShowMore = ({remaining}) => (
    <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)} activeOpacity={0.9} style={styles.showMore}>
      <Text style={styles.showMoreText}>
        {isCollapsed
          ? `Hide ${remaining.length > 1 ? 'Items' : 'Item'}`
          : // : `(${remaining.length}) More ${remaining.length > 1 ? 'items' : 'item'}`}
            'Show More'}
      </Text>
      <FA5Icon name={isCollapsed ? 'chevron-up' : 'chevron-down'} size={12} color={'#FFA700'} />
    </TouchableOpacity>
  );

  const filterVariants = () => {
    let variantHolder = [];
    const variants = data.variants;
    if (variants.length) {
      variants.map(variant => {
        if (variant.enabled === 1 && (variant.stocks > 0 || variant.contSellingIsset > 0)) {
          variantHolder.push(variant);
        }
      });
    }
    return variantHolder;
  };

  const Variants = () => {
    const variants = filterVariants();
    let dataSource = [];
    let remaining = [];

    if (variants.length > 5) {
      dataSource = variants.slice(0, 5);
      remaining = variants.slice(4, -1);
    } else {
      dataSource = variants;
    }

    if (data?.variants.length) {
      const listData = isCollapsed ? variants : dataSource;
      return (
        <React.Fragment>
          <View style={styles.variantContainer}>
            <View style={styles.flexCenter}>
              <Text style={styles.variantTitle}>Variation (Select 1)</Text>
              <View style={styles.requiredContainer}>
                <Text style={styles.requiredText}>Required</Text>
              </View>
            </View>
            {listData.map(item => (
              <Variant item={item} />
            ))}
            {variants.length > 5 && <VariantShowMore remaining={remaining} />}
            {/* <FlatList
              data={isCollapsed ? data.variants : dataSource}
              renderItem={renderVariants}
              style={{flex: 1}}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                data.variants.length > 5 && (
                  <TouchableOpacity
                    onPress={() => setIsCollapsed(!isCollapsed)}
                    activeOpacity={0.9}
                    style={styles.showMore}>
                    <Text style={{marginRight: moderateScale(12), color: '#FFA700'}}>
                      {isCollapsed
                        ? `Hide ${remaining.length > 1 ? 'Items' : 'Item'}`
                        : // : `(${remaining.length}) More ${remaining.length > 1 ? 'items' : 'item'}`}
                          'Show More'}
                    </Text>
                    <FA5Icon name={isCollapsed ? 'chevron-up' : 'chevron-down'} size={12} color={'#FFA700'} />
                  </TouchableOpacity>
                )
              }
            /> */}
          </View>
          <Separator />
        </React.Fragment>
      );
    }
    return null;
  };

  // const Notes = () =>
  //   useMemo(() => {
  //     return (
  //       <View style={[styles.variations]}>
  //         <View style={styles.instructionContainer}>
  //           <Text style={styles.variationTitle}>Special Instructions</Text>
  //           <View style={styles.requiredContainer}>
  //             <Text style={styles.requiredText}>Optional</Text>
  //           </View>
  //         </View>
  //         <TextInput
  //           value={notes}
  //           multiline={true}
  //           numberOfLines={4}
  //           style={styles.input}
  //           maxLength={60}
  //           placeholder="e.g. no cutlery."
  //           placeholderTextColor={COLOR.MEDIUM}
  //           onChangeText={notes => setNotes(notes)}
  //         />
  //       </View>
  //     );
  //   });

  return (
    <>
      <Variants />
      <Options />

      <View style={[styles.variations]}>
        <View style={styles.instructionContainer}>
          <Text style={styles.variationTitle}>Special Instructions</Text>
          <View style={styles.requiredContainer}>
            <Text style={styles.requiredText}>Optional</Text>
          </View>
        </View>
        <TextInput
          value={notes}
          multiline={true}
          numberOfLines={4}
          style={styles.input}
          maxLength={60}
          placeholder="e.g. no cutlery."
          placeholderTextColor={COLOR.MEDIUM}
          onChangeText={notes => setNotes(notes)}
        />
      </View>
      {/* <FlatList ListFooterComponent={Notes} data={data.options} renderItem={renderOptions} style={{flex: 1}} /> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  variations: {
    borderBottomWidth: 8,
    borderBottomColor: COLOR.LIGHT,
    paddingHorizontal: verticalScale(15),
    paddingVertical: verticalScale(15),
  },
  variationsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: verticalScale(10),
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
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.REGULAR,
    textDecorationLine: 'none',
  },
  variationTitle: {
    color: COLOR.BLACK,
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
    // textTransform: 'capitalize',
  },
  variantTitle: {
    color: COLOR.BLACK,
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
  },
  variationPrice: {
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
  flexCenter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requiredContainer: {
    borderWidth: 1,
    borderColor: '#FFA700',
    padding: 5,
    borderRadius: 5,
  },
  requiredText: {
    color: '#FFA700',
    fontSize: FONT_SIZE.S,
  },
  variantContainer: {
    paddingHorizontal: verticalScale(15),
    paddingVertical: verticalScale(15),
  },
  variantWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  instructionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  variantSubWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 1,
  },
  showMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: moderateScale(20),
    paddingBottom: moderateScale(10),
    // paddingBottom: moderateScale(20),
    // marginBottom: moderateScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#F7F7FA',
  },
  showMoreText: {marginHorizontal: moderateScale(10), color: '#FFA700'},
});
