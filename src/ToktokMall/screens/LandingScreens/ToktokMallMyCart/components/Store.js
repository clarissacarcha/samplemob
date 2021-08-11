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
			res += items[x].price * items[x].qty
		}
		setTotalAmount(res)
	}, [])

	useEffect(() => {
		setSelected(state)
  }, [state])
  

  return (
    <>
      <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
        <View style={{flex: 1, justifyContent: 'center'}}>
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
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image source={require("../../../../assets/icons/store.png")} style={{width: 18, height: 18, resizeMode: 'stretch'}} />
        </View>
        <TouchableOpacity onPress={onPress} style={{flex: 9, justifyContent: 'center', flexDirection: 'row'}}>                        
          <View style={{flex: 12, justifyContent: 'center'}}>
            <Text style={{fontSize: 14, fontFamily: FONT.BOLD}}>{data.store}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{height: 2, backgroundColor: '#F7F7FA'}} />			
    </>
  )
}