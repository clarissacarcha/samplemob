import React, {useCallback, useMemo, forwardRef, useState} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Text, TextInput, FlatList} from 'react-native';
import BottomSheet, {BottomSheetBackdrop, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {LIGHT, ORANGE, MEDIUM} from '../../../../../res/constants';
import {COLOR, FONT, FONT_SIZE} from '../../../../../res/variables';
import {WhiteButton, BlackButton} from '../../../../../revamp';
import {ItemDescription} from '../../../../../components/ItemDescription';

export const PartnerBranchItemDescriptionBottomSheet = forwardRef(({onChange, partnerOrders}, ref) => {
  const snapPoints = useMemo(() => [0, 500], []);

  // console.log(JSON.stringify(partnerOrders, null, 4));

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
        <FlatList
          data={partnerOrders}
          renderItem={({item, index}) => (
            <WhiteButton
              label={item.cargo.type}
              borderless
              labelColor={COLOR.MEDIUM}
              onPress={() => {
                onChange(item);
                ref.current.collapse();
              }}
            />
          )}
        />
        {/* {renderOrderSelection} */}
        {/* <Text> {JSON.stringify(partnerOrders, null, 4)}</Text> */}

        {/* <WhiteButton
          label="Food"
          borderless
          labelColor={COLOR.MEDIUM}
          onPress={() => {
            onChange('Food');
            ref.current.collapse();
          }}
        />
        <WhiteButton
          label="Document"
          borderless
          labelColor={COLOR.MEDIUM}
          onPress={() => {
            onChange('Document');
            ref.current.collapse();
          }}
        />
        <WhiteButton
          label="Clothing"
          borderless
          labelColor={COLOR.MEDIUM}
          onPress={() => {
            onChange('Clothing');
            ref.current.collapse();
          }}
        />
        <WhiteButton
          label="Large"
          borderless
          labelColor={COLOR.MEDIUM}
          onPress={() => {
            onChange('Large');
            ref.current.collapse();
          }}
        />
        <WhiteButton
          label="Others"
          borderless
          labelColor={COLOR.MEDIUM}
          onPress={() => {
            onChange('Others');
            ref.current.collapse();
          }}
        /> */}
      </View>
    </BottomSheet>
  );
});

export const PartnerBranchItemDescriptionForm = ({value, onChange, bottomSheetRef}) => {
  const placeholder = 'What are you looking for?';

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
        labelStyle={{color: COLOR.DARK, fontFamily: FONT.REGULAR}}
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
