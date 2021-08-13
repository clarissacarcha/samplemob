import React, {useState, useEffect} from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList} from 'react-native'
import { HeaderBack, HeaderTitle, HeaderRight } from '../../../../Components';
import { AlertOverlay} from '../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';
import CheckBox from 'react-native-check-box';
import {placeholder} from '../../../../assets';
import {Price} from '../../../../helpers';

export const Item = ({index, data, state = true, onSelect, item, storeIndex, uncheckedItems , setstoreitemselected, storeitemselected} ) => {

  const [selected, setSelected] = useState(state)

  data = data.cart[0]

  useEffect(() => {
    setSelected(state)
    console.log("Data", data)
  }, [state])
  
  const onPress = () => {
    // uncheckedItems.push(i)
    
    if(selected){
      // if()
      uncheckedItems.push(index)
    }else{
      if(index != uncheckedItems.length){
        uncheckedItems.splice(index, 1)
      }else {
        uncheckedItems.splice(0, 1)
      }
    }
    if( uncheckedItems.length == item.cart.length  ){
      // console.log('fire this')
      setstoreitemselected(false)
    } else if ( uncheckedItems == 0){
      setstoreitemselected(true)
    }
    // console.log(uncheckedItems, index, uncheckedItems.length, item.cart.length)
    setSelected(!selected)
  }

  const getImageSource = (data) => {
    if(typeof data == "object" && data.length > 0){
      return {uri: data[0].filename}
    }else {
      return placeholder
    }
  }

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
                item: data,
                amount: data.price * data.qty,
                qty: data.qty,
                index: index,
                storeIndex: storeIndex
              })
              // if()
              // setSelected(!selected)
              onPress()
              // deleteItem(data.item_id)
						}}
					/>
        </View>
				<View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
					<Image source={getImageSource(data?.images)} style={{width: 50, height: 65, resizeMode: 'stretch'}} />
				</View>
        <View style={{flex: 9, justifyContent: 'center', flexDirection: 'row'}}>                        
          <View style={{flex: 1, justifyContent: 'center'}}>
          	<View>
							<Text style={{fontSize: 14, fontWeight: '100'}}>{data?.label}</Text>
						</View>
						<View style={{flexDirection: 'row'}}>
              <View style={{flex: 0}}>
								<Text style={{fontSize: 13, color: "#F6841F"}}><Price amount={data?.price} /></Text>
              </View>
							<View style={{flex: 0, paddingHorizontal: 15}}>
								<Text style={{color: "#9E9E9E", textDecorationLine: 'line-through', fontSize: 10}}>{data?.compareAtPrice ? <Price amount={data?.compareAtPrice} /> : ""}</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Text style={{color: "#9E9E9E", fontSize: 13}}>Variation: {data?.variation || "No variation"}</Text>
              </View>
              <View style={{flex: 0}}>
                <Text style={{color: "#9E9E9E", fontSize: 13}}>Qty: {data?.qty}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={{height: 2, backgroundColor: '#F7F7FA'}} />
    </>
    )
}