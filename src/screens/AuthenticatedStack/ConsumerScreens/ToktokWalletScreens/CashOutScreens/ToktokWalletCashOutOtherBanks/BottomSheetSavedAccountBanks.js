import React, { useMemo, forwardRef , useState, useEffect} from 'react';
import {View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity,Dimensions} from 'react-native';
import BottomSheet, {BottomSheetBackdrop, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {COLOR, FONT, FONT_SIZE, SIZE} from '../../../../../../res/variables';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql'
import {GET_BANKS} from '../../../../../../graphql/toktokwallet'
import { useLazyQuery } from '@apollo/react-hooks';
import { onErrorAlert } from '../../../../../../util/ErrorUtility';
import { useAlert } from '../../../../../../hooks';
import { useNavigation } from '@react-navigation/native';


const {height,width} = Dimensions.get("window")

const BottomSheetSavedAccountBanks = forwardRef(({onChange}, ref) => {

const alert = useAlert()
const snapPoints = useMemo(() => [0, height * 0.5], []);
const [banks,setBanks] = useState([])
const navigation = useNavigation()

const selectBank = (bank)=> {
  ref.current.close()
  return navigation.navigate("ToktokWalletCashOutSaveAccount", {bank: bank})
}

const [getBanks] = useLazyQuery(GET_BANKS, {
    fetchPolicy:"network-only",
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: (error)=> {
        onErrorAlert({alert,error})
    },
    onCompleted: ({getBanks})=> {
        setBanks(getBanks)
    }
})

useEffect(()=>{
    getBanks()
},[onChange])

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
        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,marginBottom: 5}}>Choose Bank</Text>
        <FlatList
          data={banks}
          ItemSeparatorComponent={() => <View style={{height: 1, borderColor: COLOR.LIGHT}} />}
          renderItem={({item, index}) => (
            <TouchableOpacity onPress={()=>selectBank(item)} style={[styles.banks]}>
                    <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>{item.name} - {item.code}</Text>
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
  banks: {
    height: SIZE.FORM_HEIGHT,
    alignItems:"center",
    borderBottomWidth: .2,
    borderColor: "silver",
    flexDirection:"row"
  },
  bankLogo: {
    height: 30,
    width: 30,
    backgroundColor:"white",
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

export default BottomSheetSavedAccountBanks