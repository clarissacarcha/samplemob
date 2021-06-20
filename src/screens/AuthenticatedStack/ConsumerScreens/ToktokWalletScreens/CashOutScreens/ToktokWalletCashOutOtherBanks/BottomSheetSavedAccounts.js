import React, { useMemo, forwardRef , useState, useEffect} from 'react';
import {View, StyleSheet, Text, TextInput, FlatList, TouchableHighlight,Dimensions,TouchableOpacity} from 'react-native';
import BottomSheet, {BottomSheetBackdrop, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {COLOR, FONT, FONT_SIZE, SIZE} from '../../../../../../res/variables';
import { VectorIcon , ICON_SET} from '../../../../../../revamp'
import { useNavigation } from '@react-navigation/native';

const {height,width} = Dimensions.get("window")

const BottomSheetSavedAccounts = forwardRef(({accounts}, ref) => {

const snapPoints = useMemo(() => [0, height * 0.7], []);
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
      <View style={{flexDirection:"row"}}>
            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,marginBottom: 10}}>Choose Account</Text>
            <TouchableOpacity onPress={()=>ref.current.close()} style={{flex: 1,alignItems:"flex-end",justifyContent:"flex-start"}}>
              <VectorIcon iconSet={ICON_SET.FontAwesome5} name="chevron-down" color="black"/>
            </TouchableOpacity>
          </View>
        <FlatList
          data={accounts}
          ItemSeparatorComponent={() => <View style={{height: 1, borderColor: COLOR.LIGHT}} />}
          renderItem={({item, index}) => (
            <TouchableHighlight underlayColor={'#FFFFE5'} onPress={()=>selectAccount(item)} style={[styles.banks]}>
              <>
                  <View style={[styles.bankLogo,{justifyContent:'center',alignItems:"center"}]}>
                            <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>{item.bank.name[0].toUpperCase()}</Text>
                  </View>
                  <View style={{flex: 1}}>
                      <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.S}}>{item.bank.name}</Text>
                      <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S}}>Account Number: {item.accountNumber}</Text>
                      <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S}}>Account Name: {item.accountName}</Text>
                  </View>
                  <View>
                      <VectorIcon iconSet={ICON_SET.Feather} name="chevron-right" color={COLOR.DARK} />
                  </View> 
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
    height: SIZE.FORM_HEIGHT + 20,
    alignItems:"center",
    borderBottomWidth: .2,
    borderColor: "silver",
    flexDirection:"row",
    paddingHorizontal: 2
  },
  bankLogo: {
    height: 50,
    width: 50,
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
  },
  accountValue: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR
  }
});

export default BottomSheetSavedAccounts