import React, {useState, useEffect, useContext} from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList} from 'react-native'
import { HeaderBack, HeaderTitle, HeaderRight } from '../../../../Components';
import { AlertOverlay} from '../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';
import CheckBox from 'react-native-check-box';
import {placeholder} from '../../../../assets';
import {ApiCall, ArrayCopy, Price} from '../../../../helpers';
import AIcons from 'react-native-vector-icons/dist/Entypo'

import { CartContext } from '../ContextProvider';
import { EventRegister } from 'react-native-event-listeners';
import { debounce } from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';

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
  setHeldItem,
  recenter
}) => {

  const CartContextData = useContext(CartContext)
  const [selected, setSelected] = useState((data.product.enabled === 1 && data.product.noOfStocks !== 0)? state : false)
  const [qty, setQty] = useState(1)
  const [product, setproduct] = useState({})
  const [shopId, setShopId] = useState()

  useEffect(() => {
    getRealtimeItemQuantity()
  }, [])

  useEffect(() => {
    // setQty(data.quantity)
    getRealtimeItemQuantity()
    setQty(data.quantity)
    setShopId(data.shopid)
    setproduct(data.product)    
  },[data])

  useEffect(() => {
    setSelected((data.product.enabled === 1 &&  data.product.noOfStocks !== 0)? state : false)
  }, [state])

  // useEffect(() => {
  //   if(forceSelect && data.product.enabled !== 1 ) setSelected(true)
  // }, [forceSelect])

  useEffect(() => {
    if(forceSelectToZero ) setSelected(false)
  }, [forceSelectToZero])

  useEffect(() => {
    
    if(heldItem?.product?.Id == data.product.Id && heldItem?.shopId == data.shopid ) {
      setSelected(true) 
      console.log('fire this to set selected to true')
    } 
  }, [heldItem])

  const getRealtimeItemQuantity = () => {
    if(CartContextData.itemQuantity && CartContextData.itemQuantity.length > 0){
      let index = CartContextData.itemQuantity.findIndex(a => a.id === data.product.Id)
      if(index > -1){
        setQty(CartContextData.itemQuantity[index].value)
      }
    }
  }

  const updateRealtimeItemQuantity = (value) => {
    if(CartContextData.itemQuantity && CartContextData.itemQuantity.length > 0){
      let index = CartContextData.itemQuantity.findIndex(a => a.id === data.product.Id)
      if(index > -1){
        let newList = ArrayCopy(CartContextData.itemQuantity)
        newList[index].value = value
        CartContextData.setItemQuantity(newList)
      }
    }
  }

  const onPress = () => {
    
  }

  const getImageSource = (imgs) => {
    if(imgs && typeof imgs == "string"){
      return {uri: imgs}
    }else {
      return placeholder
    }
  }

  const getCheckboxState = (item, type) => {
    
    if(type == "disabled"){
      if(CartContextData.willDelete){
        return false
      }else{
        if(item.contSellingIsset === 0 && item.noOfStocks <= 0){
          return true
        }else if(item.enabled == 1){
          return false
        }else{
          return true
        }
      }
    }else if(type == "boxcolor"){
      if(CartContextData.willDelete){
        return "#F6841F"
      }else{
        if(item.contSellingIsset === 0 && item.noOfStocks <= 0){
          return "#ECECEC"
        }else if(item.enabled == 1){
          return "#F6841F"
        }else{
          return "#ECECEC"
        }
      }
    }
  }

  const updateItemQuantityOnCart = async (qty) => {
    try {
      const ToktokMallUser = await AsyncStorage.getItem("ToktokMallUser")
      const user = JSON.parse(ToktokMallUser)
      let variables = {
        userid: user.userId,
        shopid: shopId,
        branchid: 0,
        productid: product.Id,
        quantity: qty
      }
      const req = await ApiCall("insert_cart", variables, true)
      if(req.responseData && req.responseData.success == 1){
        EventRegister.emit('refreshToktokmallShoppingCart')
      }
    }catch(error){
      console.error('updateItemQuantityOnCart', error);
    }
  }

  const RenderQuantity = (product) => {

    const {enabled, contSellingIsset, noOfStocks} = product

    if(enabled === 0) return null
    else if(enabled === 1 && contSellingIsset == 0 && noOfStocks == 0) return null

    return (
      <>
        <View style={{flexDirection: 'row', marginTop: 7, alignItems: 'center', height: 40}}>
          <Text style = {{fontFamily: FONT.REGULAR, fontSize: 12}}>Qty</Text>
            <TouchableOpacity 
              style = {{marginLeft: 10,  alignItems: 'center', justifyContent: 'center',  height: 25,width: 25, borderWidth: 1, borderColor: '#F8F8F8'}}
              disabled = {qty == 1}
              onPress = {() => {
              // if(selected){
                onChangeQuantity(qty - 1, product?.Id)
                setQty(qty - 1)
                updateRealtimeItemQuantity(qty - 1)
                debounce(() => updateItemQuantityOnCart(qty - 1), 500)();
              // }
              }}
            >
              <AIcons
                name = {'minus'}
                size = {18}
                color = {qty == 1 ? '#D7D7D7':  COLOR.ORANGE}
              />
            </TouchableOpacity>
            <View 
              style = {{backgroundColor: '#F8F8F8', padding: 2, height: 25,width: 35, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F8F8F8'}}>
              <Text style={{fontSize: 12}}>{qty}</Text>
            </View>
            <TouchableOpacity
              style = {{alignItems: 'center', justifyContent: 'center',  height: 25,width: 25, borderWidth: 1, borderColor: '#F8F8F8'}}
              disabled={product.noOfStocks === qty || qty === 200}
              onPress = {() => {
                // if(selected){
                onChangeQuantity(qty + 1, product?.Id)
                setQty(qty + 1)
                updateRealtimeItemQuantity(qty + 1)
                debounce(() => updateItemQuantityOnCart(qty + 1), 500)();
                // }
              }}
            >
            <AIcons
              name = {'plus'}
              size = {15}
              color = {qty == product.noOfStocks || qty === 200 ? '#D7D7D7':  COLOR.ORANGE}
            />
          </TouchableOpacity>
        </View>
      </>
    )
  }
  
  return (
    <View>          
      <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
        <View style={{flex: 0, justifyContent: 'center'}}>
          <CheckBox
            disabled={getCheckboxState(product, "disabled")}
            isChecked={selected}
            checkedCheckBoxColor="#F6841F"
						uncheckedCheckBoxColor={getCheckboxState(product, "boxcolor")}
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
            setSelected(!selected)
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
          onPress = {() => {recenter()}}
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

              {/* {product.enabled == 1 && product.contSellingIsset === 0 && product.noOfStocks !== 0 &&
                <RenderQuantity />
              }

              {product.enabled == 1 && product.contSellingIsset === 1 &&
                <RenderQuantity />
              } */}
              <RenderQuantity product={product} />

              {product?.enabled != 1 &&
                <View style={{paddingVertical: 15}}>
                  <View style={{borderWidth: 0.5, borderColor: '#F6841F', width: '50%', alignItems: 'center', borderRadius: 2}}>
                    <Text style={{fontSize: 11, color: "#F6841F"}}>Product not available</Text>
                  </View>
                </View>              
              }

              {product?.enabled == 1 && product?.contSellingIsset === 0 && product?.noOfStocks <= 0 &&
                <View style={{paddingVertical: 15}}>
                  <View style={{borderWidth: 0.5, borderColor: '#F6841F', width: '35%', alignItems: 'center', borderRadius: 2}}>
                    <Text style={{fontSize: 11, color: "#F6841F"}}>Out of Stock</Text>
                  </View>
                </View>              
              }

            </View>
          </View>
        </TouchableOpacity>

      </View>
      <View style={{height: 2, backgroundColor: '#F7F7FA'}} />
		</View>
  )
}