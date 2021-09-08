import React, {useState, useEffect} from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList} from 'react-native'
import { HeaderBack, HeaderTitle, HeaderRight } from '../../../../Components';
import { AlertOverlay} from '../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';
import CheckBox from 'react-native-check-box';
import {placeholder} from '../../../../assets';
import {Price} from '../../../../helpers';
import AIcons from 'react-native-vector-icons/dist/Entypo'

export const Item = ({
  index, 
  data, 
  state = true, 
  onSelect, 
  onHold,
  item, 
  storeIndex, 
  uncheckedItems , 
  setstoreitemselected, 
  storeitemselected,
  onChangeQuantity
}) => {

  const [selected, setSelected] = useState(state)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    setQty(data.qty)
  },[data])

  useEffect(() => {
    setSelected(state)
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
    // if( uncheckedItems.length == item.cart.length  ){
    //   // console.log('fire this')
    //   setstoreitemselected(false)
    // } else if ( uncheckedItems == 0){
    //   setstoreitemselected(true)
    // }
    // console.log(uncheckedItems, index, uncheckedItems.length, item.cart.length)
    setSelected(!selected)
  }

  const getImageSource = (imgs) => {
    if(typeof imgs == "object" && imgs.length > 0){
      return {uri: imgs[0].filename}
    }else {
      return placeholder
    }
  }
  
  return (
    <TouchableOpacity onLongPress={() => {
      onHold({
        checked: !selected,
        item: data,
        amount: data.price * data.qty,
        qty: qty,
        index: index,
        storeIndex: storeIndex
      })
      onPress()
    }}>          
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
                qty: qty,
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
							<Text style={{fontSize: 14, fontWeight: '100'}}>{data?.label}</Text>
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
                <Text style={{color: "#9E9E9E", fontSize: 13}}>Variation: {data?.variation || "None"}</Text>
              </View>
              {/* <View style={{flex: 0}}>
                <Text style={{color: "#9E9E9E", fontSize: 13}}>Qty: {data?.qty}</Text>
              </View> */}
            </View>
            <View style={{flexDirection: 'row', marginTop: 7, alignItems: 'center', height: 40}}>
              <Text style = {{fontFamily: FONT.REGULAR, fontSize: 12}}>Qty</Text>
              <TouchableOpacity 
                style = {{marginLeft: 10,  alignItems: 'center', justifyContent: 'center',  height: 25,width: 25,
                  borderWidth: 1, borderColor: '#F8F8F8'
                }}
                disabled = {qty == 1}
                onPress = {() => {
                  onChangeQuantity(qty - 1, data?.item_id)
                  setQty(qty - 1)                  
                }}
              >
                <AIcons
                  name = {'minus'}
                  size = {18}
                  color = {qty == 1 ? '#D7D7D7':  COLOR.ORANGE}
                />
              </TouchableOpacity>
              <View 
                style = {{backgroundColor: '#F8F8F8', padding: 5, height: 25,width: 35, alignItems: 'center', justifyContent: 'center',
                borderWidth: 1, borderColor: '#F8F8F8'
              }}>
                <Text>{qty}</Text>
              </View>
              <TouchableOpacity
                style = {{alignItems: 'center', justifyContent: 'center',  height: 25,width: 25,
                  borderWidth: 1, borderColor: '#F8F8F8'
                }}
                disabled={data.noOfStocks === qty}
                onPress = {() => {
                  onChangeQuantity(qty + 1, data?.item_id)
                  setQty(qty + 1)
                }}
              >
                <AIcons
                  name = {'plus'}
                  size = {15}
                  color = {qty == data.noOfStocks ? '#D7D7D7':  COLOR.ORANGE}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={{height: 2, backgroundColor: '#F7F7FA'}} />
						</TouchableOpacity>
    )
}