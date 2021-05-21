import React, {useCallback, useEffect, useMemo, forwardRef, useState, useContext} from 'react';
import {useSelector} from 'react-redux';
import {VerifyContext} from './VerifyContextProvider'
import {View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity} from 'react-native';
import BottomSheet, {BottomSheetBackdrop, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {LIGHT, ORANGE, MEDIUM, FONTS, SIZES, INPUT_HEIGHT, COLORS} from '../../../../../../../res/constants';
import {COLOR, FONT, FONT_SIZE} from '../../../../../../../res/variables';
import {WhiteButton, BlackButton, VectorIcon, ICON_SET} from '../../../../../../../revamp';
import {useQuery,useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT } from '../../../../../../../graphql'
import { GET_IDENTIFICATION_CARDS } from '../../../../../../../graphql/toktokwallet/virtual'

let validIDList = [
    {label: "Passport" ,value: "Passport", isBackRequired: 1},
    {label: "Driver's License" ,value: "Driver's License", isBackRequired: 1},
    {label: "SSS UMID Card" ,value: "SSS UMID Card", isBackRequired: 1},
    {label: "Philhealth ID" ,value: "Philhealth ID", isBackRequired: 1},
    {label: "TIN Card" ,value: "TIN Card", isBackRequired: 0},
    {label: "Postal ID" ,value: "Postal ID", isBackRequired: 0},
    {label: "Voter's ID" ,value: "Voter's ID", isBackRequired: 0},
    {label: "Professional Regulation Commission ID" ,value: "Professional Regulation Commission ID", isBackRequired: 1},
    {label: "Senior Citizen ID" ,value: "Senior Citizen ID", isBackRequired: 0},
    {label: "OFW ID" ,value: "OFW ID", isBackRequired: 1},
]

validIDList = validIDList.sort((a,b)=> a.value > b.value ? 1 : -1)

const BottomSheetIDType = forwardRef(({onChange}, ref) => {
  
    const snapPoints = useMemo(() => [0, 550], []);
    const constants = useSelector((state) => state.constants);
    const {changeVerifyID, setIdentificationId} = useContext(VerifyContext)
    const [filteredValidID, setFilteredValidID] = useState([])

    const [getIdentificationCards, {error, loading}] = useLazyQuery(GET_IDENTIFICATION_CARDS, {
      client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        console.log("IDS", response)
        setFilteredValidID(response.getIdentificationCards)
      },
      onError: (err) => {
        console.log(err)
      }
    })

    useEffect(() => {
      getIdentificationCards()
    }, [])

    const selectValidID = (index)=> {
        const validID = filteredValidID[index].name
        changeVerifyID("idType",validID)
        setFilteredValidID(validIDList)
        setIdentificationId(filteredValidID[index].id)
        onChange(filteredValidID[index])
        ref.current.collapse()
        console.log(filteredValidID[index].id)
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
        <Text style={{fontFamily: FONT.BOLD}}>Select ID Type</Text>
        <View style={{height: 10}} />
        <FlatList
          data={filteredValidID}
          ItemSeparatorComponent={() => <View style={{borderBottomWidth: 1, borderColor: COLOR.LIGHT}} />}
          renderItem={({item, index}) => (
            <TouchableOpacity onPress={()=>selectValidID(index)} style={[styles.validID]}>
                    <Text style={{fontFamily: FONTS.REGULAR, fontSize: SIZES.M}}>{item.name}</Text>
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

export default BottomSheetIDType