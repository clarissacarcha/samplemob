import React, { useMemo, forwardRef , useState, useEffect,useCallback,memo} from 'react';
import {View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity,Dimensions,TouchableHighlight} from 'react-native';
import BottomSheet, {BottomSheetBackdrop, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {COLOR, FONT, FONT_SIZE, SIZE} from '../../../../../../res/variables';
import { useNavigation } from '@react-navigation/native';
import { VectorIcon , ICON_SET} from '../../../../../../revamp'

const {height,width} = Dimensions.get("window")

const BottomSheetChooseBank = forwardRef(({banks }, ref) => {

  console.log("RUNNING SO LONG")

const snapPoints = useMemo(() => [0, height * 0.8], []);
const navigation = useNavigation()
const [filteredBanks,setFilteredBanks] = useState([])

useEffect(()=>{
  setFilteredBanks(banks)
},[banks])

const filterSearch = (value) => {
  const filtered = banks.filter(bank=> bank.name.toLowerCase().includes(value.toLowerCase()))
  setFilteredBanks(filtered)
}


const selectBank = (bank)=> {
    ref.current.close()
    setFilteredBanks(banks)
    console.log(bank)
    // onChange(bank)
}

  return (
    <BottomSheet
    // style={{marginTop: 30}}
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enableHandlePanningGesture={true}
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
            borderColor: COLOR.ORANGE,
            marginHorizontal: -2,
          }}
        />
      )}
      backdropComponent={BottomSheetBackdrop}>
         <View style={styles.sheet}>
          <View style={{flexDirection:"row"}}>
            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,marginBottom: 10}}>Choose Bank</Text>
            <TouchableOpacity onPress={()=>ref.current.close()} style={{flex: 1,alignItems:"flex-end",justifyContent:"flex-start"}}>
              <VectorIcon iconSet={ICON_SET.FontAwesome5} name="chevron-down" color="black"/>
            </TouchableOpacity>
          </View>
          <View>
            <TextInput 
              style={{height:SIZE.FORM_HEIGHT,borderRadius: SIZE.BORDER_RADIUS,backgroundColor:"#F7F7FA",marginBottom:5,paddingHorizontal: 16}}
              returnKeyType="done"
              onChangeText={filterSearch}
              placeholder="Search Bank"
           />
          </View>
        </View>
         <BottomSheetFlatList
          style={{paddingHorizontal:16}}
          data={filteredBanks}
          keyExtractor={i => i}
          ItemSeparatorComponent={() => <View style={{height: 1, borderColor: COLOR.LIGHT}} />}
          renderItem={({item, index}) => (
            <TouchableHighlight underlayColor="#FFFFE5" onPress={()=>selectBank(item)} style={[styles.banks]}>
              <>
              <View style={{flex: 1}}>
                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>{item.name}</Text>
                {/* <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.XS,color: COLOR.DARK}}>
                   {item.isInstaPay 
                    ? `Maximum Cash Out limit: PHP 50,000.00`  // instapay
                    : "Maximum Cash Out limit: PHP 200,000.00" // pesonet
                   }
                  </Text> */}
              </View>
              <View>
                  <VectorIcon size={12} iconSet={ICON_SET.Feather} name="chevron-right" color={COLOR.DARK} />
              </View> 
              </>
            </TouchableHighlight>     
          )}
        />
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

export default memo(BottomSheetChooseBank)