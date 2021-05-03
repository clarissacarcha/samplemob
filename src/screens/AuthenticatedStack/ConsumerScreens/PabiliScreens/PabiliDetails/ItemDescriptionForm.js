import React, {useCallback, useMemo, forwardRef, useState} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {LIGHT, ORANGE, MEDIUM} from '../../../../../res/constants';
import {COLOR, FONT, FONT_SIZE} from '../../../../../res/variables';
import {WhiteButton, BlackButton} from '../../../../../revamp';
import {ItemDescription} from '../../../../../components/ItemDescription';

export const ItemSheet = forwardRef(({onChange}, ref) => {
  const snapPoints = useMemo(() => [0, 280], []);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      handleComponent={() => (
        <View
          style={{
            height: 20,
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
        <View style={{height: 10}} />
        <WhiteButton
          label="Food"
          borderless
          labelColor={COLOR.DARK}
          onPress={() => {
            onChange('Food');
            ref.current.collapse();
          }}
        />
        <WhiteButton
          label="Document"
          borderless
          labelColor={COLOR.DARK}
          onPress={() => {
            onChange('Document');
            ref.current.collapse();
          }}
        />
        <WhiteButton
          label="Clothing"
          borderless
          labelColor={COLOR.DARK}
          onPress={() => {
            onChange('Clothing');
            ref.current.collapse();
          }}
        />
        <WhiteButton
          label="Large"
          borderless
          labelColor={COLOR.DARK}
          onPress={() => {
            onChange('Large');
            ref.current.collapse();
          }}
        />
        <WhiteButton
          label="Others"
          borderless
          labelColor={COLOR.DARK}
          onPress={() => {
            onChange('Others');
            ref.current.collapse();
          }}
        />
      </View>
    </BottomSheet>
  );
});

export const ItemDescriptionForm = ({value, onChange, bottomSheetRef}) => {
  const placeholder = 'ex. Food, Document, Clothing etc.';

  const label = value ? value : placeholder;

  return (
    <View style={styles.box}>
      <Text style={{fontFamily: FONT.BOLD}}>Item Description</Text>
      <View style={styles.spacing} />
      <WhiteButton
        label={label}
        labelColor={label ? MEDIUM : LIGHT}
        suffixSet="Material"
        suffixName="arrow-forward"
        suffixColor={LIGHT}
        delay={0}
        labelStyle={{color: COLOR.BLACK, fontFamily: FONT.REGULAR}}
        onPress={() => {
          bottomSheetRef.current.expand();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    marginBottom: 20,
  },
  sheet: {
    paddingHorizontal: 10,
  },
  spacing: {height: 2},
});
