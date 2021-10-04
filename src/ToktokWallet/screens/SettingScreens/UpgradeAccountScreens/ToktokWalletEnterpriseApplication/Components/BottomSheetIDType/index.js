import React, {useCallback, useEffect, useMemo, forwardRef, useState, useContext} from 'react';
import {View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity, Alert, BackHandler} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import { useLazyQuery } from '@apollo/react-hooks'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_ID_CARDS } from 'toktokwallet/graphql/'
import { ContextEnterpriseApplication } from '../ContextProvider'
import {useFocusEffect} from '@react-navigation/native'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS

export const BottomSheetIDType = forwardRef(({onChange,idIndex,validID1,validID2}, ref) => {
  
    const snapPoints = useMemo(() => [0, 550], []);
    const [filteredValidID, setFilteredValidID] = useState([])
    const {
        setValidID1,
        setValidID2,
    } = useContext(ContextEnterpriseApplication)

    const [getIDCards, {error, loading}] = useLazyQuery(GET_ID_CARDS, {
      client: TOKTOK_WALLET_GRAPHQL_CLIENT,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        console.log("IDS", response)
        let IDList = response.getIDCards
        if(validID1.IDType != ""){
          IDList = IDList.filter((validID)=>validID1.IDType != validID.id)
        }
        if(validID2.IDType != ""){
          IDList = IDList.filter((validID)=>validID2.IDType != validID.id)
        }
        setFilteredValidID(IDList)
      },
      onError: (err) => {
        console.log(err)
      }
    })

    useEffect(() => {
      getIDCards()
    }, [onChange])

    const selectValidID = (index)=> {
        if(idIndex == 1){
          setValidID1(state=> {
            return {
              ...state,
              IDType: filteredValidID[index].id,
              IDTypeDescription: filteredValidID[index].name,
              isBackRequired: filteredValidID[index].isBackRequired,
            }
          })
        }else{
          setValidID2(state=> {
            return {
              ...state,
              IDType: filteredValidID[index].id,
              IDTypeDescription: filteredValidID[index].name,
              isBackRequired: filteredValidID[index].isBackRequired,
            }
          })
        }
        return ref.current.collapse()
    }

  return (
    <BottomSheet
      ref={ref}
      index={-1}
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
        <Text style={{fontFamily: FONT.BOLD}}>Select ID Type</Text>
        <View style={{height: 10}} />
        <FlatList
          data={filteredValidID}
          ItemSeparatorComponent={() => <View style={{borderBottomWidth: 1, borderColor: COLOR.LIGHT}} />}
          renderItem={({item, index}) => (
            <TouchableOpacity onPress={()=>selectValidID(index)} style={[styles.validID]}>
                    <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>{item.name}</Text>
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
    height: SIZE.FORM_HEIGHT,
    justifyContent:"center",
    borderBottomWidth: .2,
    borderColor: "silver",
    paddingHorizontal:12,
  }
});
