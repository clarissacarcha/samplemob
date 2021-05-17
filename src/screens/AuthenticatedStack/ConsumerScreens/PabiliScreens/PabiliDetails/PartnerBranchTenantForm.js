import React, {useCallback, useMemo, forwardRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, StyleSheet, Text, TextInput, FlatList, ScrollView} from 'react-native';
import BottomSheet, {BottomSheetBackdrop, TouchableHighlight} from '@gorhom/bottom-sheet';
import {LIGHT, ORANGE, MEDIUM} from '../../../../../res/constants';
import {COLOR, FONT, FONT_SIZE} from '../../../../../res/variables';
import {WhiteButton, BlackButton, VectorIcon, ICON_SET} from '../../../../../revamp';
import {ItemDescription} from '../../../../../components/ItemDescription';

export const PartnerBranchTenantBottomSheet = forwardRef(({onChange, tenants}, ref) => {
  const snapPoints = useMemo(() => [0, 400], []);

  // console.log(JSON.stringify({tenants}, null, 4));

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
      backdropComponent={BottomSheetBackdrop}
      enableHandlePanningGesture={false}
      enableContentPanningGesture={false}>
      <View style={styles.sheet}>
        <Text style={{fontFamily: FONT.BOLD}}>Select Store</Text>
        <View style={{height: 10}} />

        <FlatList
          data={tenants}
          keyExtractor={(i) => i}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{borderBottomWidth: 1, borderColor: COLOR.LIGHT}} />}
          renderItem={({item, index}) => (
            // <WhiteButton
            //   label={item.name}
            //   borderless
            //   labelColor={COLOR.DARK}
            //   onPress={() => {
            // onChange(item);
            // ref.current.collapse();
            //   }}
            // />
            <TouchableHighlight
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
                <Text style={{flex: 1}}>{item.name}</Text>
              </View>
            </TouchableHighlight>
          )}
        />
        {/* <View style={{height: 10, backgroundColor: 'red'}} /> */}
      </View>
    </BottomSheet>
  );
});

export const PartnerBranchTenantForm = ({value, onChange, bottomSheetRef}) => {
  const placeholder = 'Select store';

  const label = value ? value : placeholder;

  return (
    <View style={styles.box}>
      <Text style={{fontFamily: FONT.BOLD}}>Store</Text>
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
