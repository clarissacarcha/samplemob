import React, { useMemo, forwardRef , useState, useEffect} from 'react';
import {View, StyleSheet, Text, TextInput, FlatList, TouchableHighlight,Dimensions} from 'react-native';
import BottomSheet, {BottomSheetBackdrop, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {COLOR, FONT, FONT_SIZE, SIZE} from '../../../../../../res/variables';
import { useNavigation } from '@react-navigation/native';

const {height,width} = Dimensions.get("window")

const BottomSheetSavedAccounts = forwardRef(({accounts}, ref) => {

const snapPoints = useMemo(() => [0, height * 0.5], []);
const navigation = useNavigation()

const selectAccount = (bankAccount)=> {
    ref.current.close()
    return navigation.navigate("ToktokWalletCashOutViewAccount" , {bankAccount: bankAccount})
}

  return (
    <BottomSheet
      style={{marginTop: 30}}
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enableHandlePanningGesture={true}
      enableContentPanningGesture={true}
      handleComponent={() => (
        <View
          style={{
            height: 20,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            borderTopWidth: 3,
            borderRightWidth: 2,
            borderLeftWidth: 2,
            borderColor: COLOR.ORANGE,
            marginHorizontal: -2,
          }}
        />
      )}
      backdropComponent={BottomSheetBackdrop}>
      <View style={styles.sheet}>
        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,marginBottom: 5}}>Choose Account</Text>
        <FlatList
          data={accounts}
          ItemSeparatorComponent={() => <View style={{height: 1, borderColor: COLOR.LIGHT}} />}
          renderItem={({item, index}) => (
            <TouchableHighlight underlayColor="transparent" onPress={()=>selectAccount(item)} style={[styles.banks]}>
              <>
                  <View style={[styles.bankLogo,{justifyContent:'center',alignItems:"center"}]}>
                            <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>{item.bank.name[0].toUpperCase()}</Text>
                      </View>
                    <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>{item.accountNumber} - {item.accountName}</Text>
              </>
            </TouchableHighlight>     
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
  banks: {
    height: SIZE.FORM_HEIGHT,
    alignItems:"center",
    borderBottomWidth: .2,
    borderColor: "silver",
    flexDirection:"row",
    paddingHorizontal: 2
  },
  bankLogo: {
    height: 30,
    width: 30,
    backgroundColor: COLOR.YELLOW,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginRight: 10,
  }
});

export default BottomSheetSavedAccounts