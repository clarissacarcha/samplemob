import React, {useCallback, useMemo, forwardRef, useState} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {COLOR, LIGHT, ORANGE, MEDIUM} from '../../../../../res/constants';
import {WhiteButton, BlackButton} from '../../../../../revamp';

export const ItemSheet = forwardRef(({}, ref) => {
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
        <Text>Item Description</Text>
        <View style={{height: 10}} />
        <WhiteButton label="Food" borderless onPress={() => {}} />
        <WhiteButton label="Document" borderless onPress={() => {}} />
        <WhiteButton label="Clothing" borderless onPress={() => {}} />
        <WhiteButton label="Large" borderless onPress={() => {}} />
        <WhiteButton label="Others" borderless onPress={() => {}} />
      </View>
    </BottomSheet>
  );
});

export const ItemForm = ({value, onChange, bottomSheetRef}) => {
  const [itemDescription, setItemDescription] = useState('');

  const placeholder = 'ex. Food, Document, Clothing etc.';

  return (
    <View style={styles.box}>
      <Text>Item Description</Text>
      <View style={styles.spacing} />
      <WhiteButton
        label={placeholder}
        labelColor={itemDescription ? MEDIUM : LIGHT}
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
