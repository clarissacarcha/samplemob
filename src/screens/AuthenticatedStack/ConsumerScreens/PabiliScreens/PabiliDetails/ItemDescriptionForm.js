import React, {useCallback, useMemo, forwardRef, useState} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Text, TextInput, TouchableHighlight} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {LIGHT, ORANGE, MEDIUM} from '../../../../../res/constants';
import {COLOR, FONT, FONT_SIZE} from '../../../../../res/variables';
import {WhiteButton, BlackButton, VectorIcon, ICON_SET} from '../../../../../revamp';
import {ItemDescription} from '../../../../../components/ItemDescription';

export const ItemSheet = forwardRef(({onChange}, ref) => {
  const snapPoints = useMemo(() => [0, 296], []);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enableHandlePanningGesture={false}
      enableContentPanningGesture={false}
      handleComponent={() => (
        <View
          style={{
            height: 16,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            borderTopWidth: 3,
            borderRightWidth: 2,
            borderLeftWidth: 2,
            borderColor: ORANGE,
            marginHorizontal: -2,
          }}
        />
      )}
      backdropComponent={BottomSheetBackdrop}>
      <View style={styles.sheet}>
        <Text style={{fontFamily: FONT.BOLD}}>Item Description</Text>
        <View style={{height: 2}} />
        <WhiteButton
          label="Food"
          borderless
          labelStyle={{fontFamily: FONT.REGULAR}}
          onPress={() => {
            onChange('Food');
            ref.current.collapse();
          }}
        />
        <WhiteButton
          label="Document"
          borderless
          labelStyle={{fontFamily: FONT.REGULAR}}
          onPress={() => {
            onChange('Document');
            ref.current.collapse();
          }}
        />
        <WhiteButton
          label="Clothing"
          borderless
          labelStyle={{fontFamily: FONT.REGULAR}}
          onPress={() => {
            onChange('Clothing');
            ref.current.collapse();
          }}
        />
        <WhiteButton
          label="Large"
          borderless
          labelStyle={{fontFamily: FONT.REGULAR}}
          onPress={() => {
            onChange('Large');
            ref.current.collapse();
          }}
        />
        <WhiteButton
          label="Others"
          borderless
          labelStyle={{fontFamily: FONT.REGULAR}}
          onPress={() => {
            onChange('Others');
            ref.current.collapse();
          }}
        />
      </View>
    </BottomSheet>
  );
});

export const ItemDescriptionForm = ({value, onChange, bottomSheetRef, otherItem, onOtherItemChange}) => {
  const placeholder = 'ex. Food, Document, Clothing etc.';

  const label = value ? value : placeholder;

  return (
    <View style={styles.box}>
      <Text style={{fontFamily: FONT.BOLD}}>Item Description</Text>
      <View style={styles.spacing} />
      <TouchableHighlight
        underlayColor={COLOR.WHITE_UNDERLAY}
        onPress={() => {
          bottomSheetRef.current.expand();
        }}
        style={{
          borderRadius: 5,
        }}>
        <View
          style={{
            height: 50,
            alignItems: 'center',
            backgroundColor: COLOR.LIGHT,
            borderRadius: 5,
            paddingHorizontal: 8,
            flexDirection: 'row',
          }}>
          <Text style={{flex: 1}}>{label}</Text>
          <VectorIcon iconSet={ICON_SET.Entypo} name="chevron-thin-right" color={COLOR.BLACK} />
        </View>
      </TouchableHighlight>
      {value === 'Others' && (
        <TextInput
          value={otherItem}
          onChangeText={onOtherItemChange}
          placeholder="Describe your item."
          style={{
            height: 50,
            alignItems: 'center',
            backgroundColor: COLOR.LIGHT,
            borderRadius: 5,
            paddingHorizontal: 8,
            marginTop: 8,
          }}
          placeholderTextColor={COLOR.MEDIUM}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    marginBottom: 20,
  },
  sheet: {
    paddingHorizontal: 16,
  },
  spacing: {
    height: 2,
  },
});
