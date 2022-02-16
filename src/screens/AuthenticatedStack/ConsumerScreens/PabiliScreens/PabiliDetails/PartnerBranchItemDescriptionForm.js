import React, {useCallback, useMemo, forwardRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {View, StyleSheet, Text, TextInput, FlatList, TouchableHighlight} from 'react-native';
import BottomSheet, {BottomSheetBackdrop, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {LIGHT, ORANGE, MEDIUM} from '../../../../../res/constants';
import {COLOR, FONT, FONT_SIZE} from '../../../../../res/variables';
import {WhiteButton, BlackButton, VectorIcon, ICON_SET} from '../../../../../revamp';
import {ItemDescription} from '../../../../../components/ItemDescription';

export const PartnerBranchItemDescriptionBottomSheet = forwardRef(({onChange, partnerOrders}, ref) => {
  const snapPoints = useMemo(() => [0, 400], []);

  const constants = useSelector(state => state.constants);

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
        <Text style={{fontFamily: FONT.BOLD}}>Select Service Type</Text>
        <View style={{height: 10}} />
        <FlatList
          data={partnerOrders}
          keyExtractor={({index}) => index}
          ItemSeparatorComponent={() => <View style={{borderBottomWidth: 1, borderColor: COLOR.LIGHT}} />}
          renderItem={({item, index}) => (
            // <WhiteButton
            //   label={`${item.cargo.type} - ₱${item.price}.00`}
            //   borderless
            //   labelColor={COLOR.DARK}
            //   onPress={() => {
            //     onChange(item);
            //     ref.current.collapse();
            //   }}
            // />
            <TouchableHighlight
              key={index}
              underlayColor={COLOR.WHITE_UNDERLAY}
              onPress={() => {
                onChange(item);
                ref.current.collapse();
              }}
              style={{
                borderRadius: 5,
              }}>
              <View
                style={{
                  height: 50,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingHorizontal: 8,
                  flexDirection: 'row',
                  backgroundColor: COLOR.WHITE,
                }}>
                <Text style={{flex: 1}}>{item.cargo.type}</Text>
                <Text style={{fontFamily: FONT.BOLD}}>
                  PHP {parseInt(item.price) + parseInt(constants.cashOnDeliveryFee)}.00
                </Text>
              </View>
            </TouchableHighlight>
          )}
        />
      </View>
    </BottomSheet>
  );
});

export const PartnerBranchItemDescriptionForm = ({value, onChange, bottomSheetRef}) => {
  const placeholder = 'Select service type';

  const label = value ? value : placeholder;

  return (
    <View style={styles.box}>
      <Text style={{fontFamily: FONT.BOLD}}>Service Type</Text>
      <View style={styles.spacing} />
      {/* <WhiteButton
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
          <Text style={{flex: 1, color: value ? COLOR.BLACK : COLOR.MEDIUM}}>{label}</Text>
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
  spacing: {height: 2},
});
