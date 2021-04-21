import React, {useCallback, useMemo, forwardRef, useState} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {COLOR, LIGHT, ORANGE, MEDIUM, FONT_REGULAR, FONT_MEDIUM} from '../../../../../res/constants';
import {WhiteButton, BlackButton} from '../../../../../revamp';

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
        <Text style={{fontFamily: FONT_MEDIUM}}>Item Description</Text>
        <View style={{height: 10}} />
        <WhiteButton
          label="Food"
          borderless
          onPress={() => {
            onChange('Food');
            ref.current.collapse();
          }}
        />
        <WhiteButton
          label="Document"
          borderless
          onPress={() => {
            onChange('Document');
            ref.current.collapse();
          }}
        />
        <WhiteButton
          label="Clothing"
          borderless
          onPress={() => {
            onChange('Clothing');
            ref.current.collapse();
          }}
        />
        <WhiteButton
          label="Large"
          borderless
          onPress={() => {
            onChange('Large');
            ref.current.collapse();
          }}
        />
        <WhiteButton
          label="Others"
          borderless
          onPress={() => {
            onChange('Others');
            ref.current.collapse();
          }}
        />
      </View>
    </BottomSheet>
  );
});

export const ItemForm = ({value, onChange, bottomSheetRef}) => {
  const placeholder = 'ex. Food, Document, Clothing etc.';

  const label = value ? value : placeholder;

  return (
    <View style={styles.box}>
      <Text style={{fontFamily: FONT_MEDIUM}}>Item Description</Text>
      <View style={styles.spacing} />
      <WhiteButton
        label={label}
        labelColor={label ? MEDIUM : LIGHT}
        suffixSet="Material"
        suffixName="arrow-forward"
        suffixColor={LIGHT}
        delay={0}
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
  spacing: {height: 5},
});
