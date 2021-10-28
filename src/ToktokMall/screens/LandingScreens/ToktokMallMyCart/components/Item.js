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
  forceSelect,
  index, 
  data, 
  state = false, 
  onSelect, 
  onHold,
  storeIndex, 
  onChangeQuantity,
  forceSelectToZero,
  willDelete,
  heldItem,
  setHeldItem
}) => {

  const [selected, setSelected] = useState(state)
  const [qty, setQty] = useState(data.quantity || 1)
  const [product, setproduct] = useState({})

  useEffect(() => {
    setQty(data.quantity)
    setproduct(data.product)
  },[data])

  useEffect(() => {
    setSelected(state)
  }, [state])

  useEffect(() => {
    if(forceSelect) setSelected(true)
  }, [forceSelect])

  useEffect(() => {
    if(forceSelectToZero ) setSelected(false)
  }, [forceSelectToZero])

  useEffect(() => {
    
    if(heldItem?.product?.Id == data.product.Id && heldItem?.shopId == data.shopid ) {
      setSelected(true) 
      console.log('fire this to set selected to true')
    } 
  }, [heldItem])

  const onPress = () => {
    

  }

  const getImageSource = (imgs) => {
    if(imgs && typeof imgs == "string"){
      return {uri: imgs}
    }else {
      return placeholder
    }
  }
  
  return (
    <View>          
      <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
        <View style={{flex: 0, justifyContent: 'center'}}>
          <CheckBox
            isChecked={selected}
            checkedCheckBoxColor="#F6841F"
						uncheckedCheckBoxColor="#F6841F"
						onClick={() => {							
							setSelected(!selected)
              onSelect({
                checked: !selected,
                productId: product.Id,
                shopId: data.shopid,                
                product: product,
                amount: parseFloat(product.price * qty),
                qty: qty,
                index: index,
              })
						}}
					/>
        </View>
        <TouchableOpacity 
          onLongPress={() => {
            setSelected(true)
            // onHold({
            //   checked: !selected,
            //   productId: product.Id,
            //   shopId: data.shopid,                
            //   product: product,
            //   amount: parseFloat(product.price * qty),
            //   qty: qty,
            //   index: index,
            // })
            onHold({
              checked: !selected,
              productId: product.Id,
              shopId: data.shopid,                
              product: product,
              amount: parseFloat(product.price * qty),
              qty: qty,
              index: index,
            })
          }}
          style={{
            flex: 1, flexDirection: 'row'
          }}
        >
          <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={getImageSource(product?.img?.filename)} style={{width: 50, height: 65, resizeMode: 'stretch'}} />
          </View>
          <View style={{flex: 9, justifyContent: 'center', flexDirection: 'row'}}>       
            <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={{fontSize: 13, fontWeight: '100'}} numberOfLines={2}>{product?.name}</Text>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 0}}>
                  <Text style={{fontSize: 13, color: "#F6841F"}}><Price amount={product?.price} /></Text>
                </View>
                <View style={{flex: 0, paddingHorizontal: 15, justifyContent: 'center'}}>
                  <Text style={{color: "#9E9E9E", textDecorationLine: 'line-through', fontSize: 10}}>{product?.compareAtPrice > 0 ? <Price amount={product?.compareAtPrice} /> : ""}</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text style={{color: "#9E9E9E", fontSize: 13}}>Variation: {product?.variant || "None"}</Text>
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
                    if(selected){
                      onChangeQuantity(qty - 1, product?.Id)
                      setQty(qty - 1)
                    }
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
                  disabled={product.noOfStocks === qty || qty === 200}
                  onPress = {() => {
                    if(selected){
                      onChangeQuantity(qty + 1, product?.Id)
                      setQty(qty + 1)
                    }
                  }}
                >
                  <AIcons
                    name = {'plus'}
                    size = {15}
                    color = {qty == product.noOfStocks || qty === 200 ? '#D7D7D7':  COLOR.ORANGE}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>

      </View>
      <View style={{height: 2, backgroundColor: '#F7F7FA'}} />
		</View>
  )
}