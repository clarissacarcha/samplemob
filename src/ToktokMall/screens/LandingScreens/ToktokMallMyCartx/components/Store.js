import React, {useState, useEffect} from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList} from 'react-native'
import { HeaderBack, HeaderTitle, HeaderRight } from '../../../../Components';
import { AlertOverlay} from '../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';
import CheckBox from 'react-native-check-box';

export const Store = ({data, storeIndex,  state = false, onSelect, onPress, setUncheckedItems}) => {

  const [selected, setSelected] = useState(state)
	const [items, setItems] = useState(data.cart || [])
	const [totalAmount, setTotalAmount] = useState(0)

	useEffect(() => {
		let res = 0
		for(var x=0;x<items.length;x++){
			res += parseFloat(items[x].price) * items[x].qty
		}
		setTotalAmount(res)
	}, [])

	useEffect(() => {
		setSelected(state)
  }, [state])
  

  const getStoreLogo = (raw) => {
    let loc = require("../../../../assets/icons/store.png")
    if(typeof raw == "string") return {uri: raw}
    else return loc
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.checkboxContainer}>
          <CheckBox
            isChecked={selected}
            checkedCheckBoxColor="#F6841F"
            uncheckedCheckBoxColor="#F6841F"
            onClick={() => {
							onSelect({
								checked: !selected,
								total: totalAmount,
                items: items,
                item: data,
                index: storeIndex
              })
              if(selected){
                console.log('from positive')
              }else {
                console.log('from neaggitve')
              }
              setSelected(!selected)
              
            }}
          />
        </View>
        <View style={styles.storeLogoContainer}>
          <Image source={getStoreLogo(data?.profileImages.logo || {})} style={styles.storeLogo} />
        </View>
        <TouchableOpacity onPress={onPress} style={styles.shopNameContainer}>                        
          <View style={styles.shopNameSubContainer}>
            <Text style={styles.shopNameText}>{data.shopname}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.margin1} />			
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    paddingVertical: 15, 
    paddingHorizontal: 15
  },
  checkboxContainer: {
    flex: 1, 
    justifyContent: 'center'
  },
  storeLogoContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  storeLogo: {
    width: 18, 
    height: 18, 
    resizeMode: 'stretch'
  },
  shopNameContainer: {
    flex: 9, 
    justifyContent: 'center', 
    flexDirection: 'row'
  },
  shopNameSubContainer: {
    flex: 12, 
    justifyContent: 'center'
  },
  shopNameText: {
    fontSize: 14, 
    fontFamily: FONT.BOLD
  },
  margin1: {
    height: 2, 
    backgroundColor: '#F7F7FA'
  }
})