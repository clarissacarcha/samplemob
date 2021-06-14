import React, {useMemo, forwardRef, useState} from 'react';
import {View, StyleSheet, Text, TouchableHighlight} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {LIGHT, ORANGE} from '../../../../../res/constants';
import {COLOR, FONT} from '../../../../../res/variables';
import {WhiteButton, VectorIcon, ICON_SET} from '../../../../../revamp';

export const PaymentMethodSheet = forwardRef(({onChange, balanceText, hasWallet}, ref) => {
  const snapPoints = useMemo(() => [0, 141], []);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      handleComponent={() => <View style={styles.sheetBox} />}
      backdropComponent={BottomSheetBackdrop}>
      <View style={styles.sheet}>
        <Text style={{fontFamily: FONT.BOLD}}>Payment Method</Text>
        <View style={{height: 10}} />
        <WhiteButton
          label="Cash"
          borderless
          labelStyle={{fontFamily: FONT.REGULAR}}
          onPress={() => {
            onChange('CASH');
            ref.current.collapse();
          }}
        />
        <View style={{borderBottomWidth: 1, borderColor: COLOR.LIGHT}} />
        {hasWallet ? (
          <WhiteButton
            label="toktokwallet"
            borderless
            labelStyle={{fontFamily: FONT.REGULAR}}
            onPress={() => {
              onChange('TOKTOKWALLET');
              ref.current.collapse();
            }}
            suffixText={balanceText}
          />
        ) : (
          <View style={{height: 50, justifyContent: 'center', marginLeft: 10}}>
            <Text style={{color: COLOR.MEDIUM}}>toktokwallet</Text>
          </View>
        )}

        {/* <WhiteButton label="toktok Wallet" borderless onPress={() => {}} /> */}
      </View>
    </BottomSheet>
  );
});

export const PaymentMethodForm = ({value, bottomSheetRef}) => {
  return (
    <View style={styles.box}>
      <Text style={{fontFamily: FONT.BOLD}}>Payment Method</Text>
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
  sheetBox: {
    height: 20,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopWidth: 3,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderColor: ORANGE,
    marginHorizontal: -2,
  },
});
