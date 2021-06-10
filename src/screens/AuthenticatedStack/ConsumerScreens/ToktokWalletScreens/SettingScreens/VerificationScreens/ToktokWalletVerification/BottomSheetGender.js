import React, {useCallback, useEffect, useMemo, forwardRef, useState, useContext} from 'react';
import {useSelector} from 'react-redux';
import {VerifyContext} from './VerifyContextProvider'
import {View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity} from 'react-native';
import BottomSheet, {BottomSheetBackdrop, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {LIGHT, ORANGE, MEDIUM, FONTS, SIZES, INPUT_HEIGHT, COLORS} from '../../../../../../../res/constants';
import {COLOR, FONT, FONT_SIZE} from '../../../../../../../res/variables';


const BottomSheetGender = forwardRef(({onChange}, ref) => {
  
const snapPoints = useMemo(() => [0, 150], []);

const selectGender = (gender)=> {
    onChange(gender)
}

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
        <Text style={{fontFamily: FONT.BOLD}}>Select Gender</Text>
        <View style={{height: 10}} />
        <FlatList
          data={[{description:"Female"},{description: "Male"}]}
          ItemSeparatorComponent={() => <View style={{borderBottomWidth: 1, borderColor: COLOR.LIGHT}} />}
          renderItem={({item, index}) => (
            <TouchableOpacity onPress={()=>selectGender(item.description)} style={[styles.validID]}>
                    <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>{item.description}</Text>
            </TouchableOpacity>     
          )}
        />
      </View>
    </BottomSheet>
  );
})

const styles = StyleSheet.create({
  box: {
    marginBottom: 20,
  },
  sheet: {
    paddingHorizontal: 16,
  },
  spacing: {height: 2},
  validID: {
    height: INPUT_HEIGHT,
    justifyContent:"center",
    borderBottomWidth: .2,
    borderColor: "silver",
    paddingHorizontal:12,
  }
});

export default BottomSheetGender