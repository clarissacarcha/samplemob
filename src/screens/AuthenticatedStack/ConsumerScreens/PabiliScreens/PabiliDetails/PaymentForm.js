import React, {useCallback, useMemo, forwardRef, useState} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {COLOR, LIGHT, MEDIUM, ORANGE, FONT_REGULAR, FONT_MEDIUM} from '../../../../../res/constants';
import {WhiteButton, BlackButton} from '../../../../../revamp';

export const PaymentSheet = forwardRef(({onChange}, ref) => {
  const snapPoints = useMemo(() => [0, 140], []);

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
        <Text style={{fontFamily: FONT_MEDIUM}}>Collect Payment From</Text>
        <View style={{height: 10}} />
        <WhiteButton
          label="Sender"
          borderless
          onPress={() => {
            onChange('SENDER');
            ref.current.collapse();
          }}
        />
        <WhiteButton
          label="Recipient"
          borderless
          onPress={() => {
            onChange('RECIPIENT');
            ref.current.collapse();
          }}
        />
        {/* <WhiteButton label="toktok Wallet" borderless onPress={() => {}} /> */}
      </View>
    </BottomSheet>
  );
});

export const PaymentForm = ({value, bottomSheetRef}) => {
  return (
    <View style={styles.box}>
      <Text style={{fontFamily: FONT_MEDIUM}}>Collect Payment From</Text>
      <View style={styles.spacing} />
      <WhiteButton
        label={value}
        labelColor={MEDIUM}
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
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: LIGHT,
    borderRadius: 5,
    fontSize: 14,
  },
  spacing: {height: 5},
});
