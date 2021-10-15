import React, {useCallback, useMemo, forwardRef, useState} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Text, TextInput, TouchableHighlight} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {LIGHT, MEDIUM, ORANGE, FONT_REGULAR, FONT_MEDIUM} from '../../../../../res/constants';
import {COLOR, FONT} from '../../../../../res/variables';
import {WhiteButton, VectorIcon, ICON_SET} from '../../../../../revamp';

export const PaymentSheet = forwardRef(({onChange}, ref) => {
  const snapPoints = useMemo(() => [0, 141], []);

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
        <Text style={{fontFamily: FONT.BOLD}}>Collect Payment From</Text>
        <View style={{height: 10}} />
        <WhiteButton
          label="Sender"
          borderless
          labelStyle={{fontFamily: FONT.REGULAR}}
          onPress={() => {
            onChange('SENDER');
            ref.current.collapse();
          }}
        />
        <View style={{borderBottomWidth: 1, borderColor: COLOR.LIGHT}} />
        <WhiteButton
          label="Recipient"
          borderless
          labelStyle={{fontFamily: FONT.REGULAR}}
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
      <Text style={{fontFamily: FONT.BOLD}}>Collect Payment From</Text>
      <View style={styles.spacing} />
      {/* <WhiteButton
        label={value}
        labelColor={MEDIUM}
        suffixSet="Material"
        suffixName="arrow-forward"
        suffixColor={LIGHT}
        delay={0}
        onPress={() => {
          bottomSheetRef.current.expand();
        }}
      /> */}

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
          <Text style={{flex: 1, color: value ? COLOR.BLACK : COLOR.MEDIUM}}>{value}</Text>
          <VectorIcon iconSet={ICON_SET.Entypo} name="chevron-thin-right" color={COLOR.BLACK} />
        </View>
      </TouchableHighlight>
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
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: LIGHT,
    borderRadius: 5,
    fontSize: 14,
  },
  spacing: {height: 5},
});
