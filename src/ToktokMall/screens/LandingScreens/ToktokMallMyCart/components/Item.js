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
  recenter,
  preSelectedItems
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

  // Here we are just checking the selected items from buy again.
  useEffect(() => {
    const checker = preSelectedItems?.includes(data.product.Id);

    if(checker && data?.product?.noOfStocks !== 0 && product?.enabled === 1) {
      if(product?.contSellingIsset === 0 && product?.noOfStocks > 0) {
        return setSelected(true);
      } else if(product?.contSellingIsset === 1){
        setSelected(true);
      } 
    }
  }, [data, preSelectedItems, product])

  useEffect(() => {
    setSelected(data.product?.enabled === 1 && (data.product?.contSellingIsset === 1 ? true : data.product?.noOfStocks > 0));
  }, [state]) 

  useEffect(() => {
    if(forceSelect && data.product.enabled !== 1 ) setSelected(true)
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

  const getImageSource = (images) => {
    if(images && images.length > 0){
      return {uri: images[0]?.filename}
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
      // if(req.responseData && req.responseData.success == 1){
      //   EventRegister.emit('refreshToktokmallShoppingCart')
      // }
    }catch(error){
      console.error('updateItemQuantityOnCart', error);
    }
  }

  const RenderQuantity = () => {

    const {enabled, contSellingIsset, noOfStocks} = product

    return (
      <>
        <View style={styles.renderQuantity}>
          <Text style={styles.renderQuantityText}>Qty</Text>
          <TouchableOpacity
            style={styles.minusButton}
            disabled={qty == 1 || product.enabled != 1 || (contSellingIsset === 0 && product.noOfStocks === 0)}
            onPress={() => {
              // if(selected){
              onChangeQuantity(product?.Id, qty - 1, shopId);
              setQty(qty - 1);
              updateRealtimeItemQuantity(qty - 1);
              debounce(() => updateItemQuantityOnCart(qty - 1), 500)();
              // }
            }}>
            <AIcons
              name={'minus'}
              size={18}
              color={
                qty == 1 || product.enabled != 1 || (contSellingIsset === 0 && product.noOfStocks === 0)
                  ? '#D7D7D7'
                  : COLOR.ORANGE
              }
            />
          </TouchableOpacity>
          <View
            style={styles.qtyContainer}>
            <Text style={styles.qtyText}>{qty}</Text>
          </View>
          <TouchableOpacity
            style={styles.plusButton}
            disabled={
              product.noOfStocks === qty ||
              qty === 200 ||
              product.enabled != 1 ||
              (contSellingIsset === 0 && product.noOfStocks === 0)
            }
            onPress={() => {
              // if(selected){
              onChangeQuantity(product?.Id, qty + 1, shopId);
              setQty(qty + 1);
              updateRealtimeItemQuantity(qty + 1);
              debounce(() => updateItemQuantityOnCart(qty + 1), 500)();
              // }
            }}>
            <AIcons
              name={'plus'}
              size={15}
              color={
                qty == product.noOfStocks ||
                qty === 200 ||
                product.enabled != 1 ||
                (contSellingIsset === 0 && product.noOfStocks === 0)
                  ? '#D7D7D7'
                  : COLOR.ORANGE
              }
            />
          </TouchableOpacity>
        </View>
      </>
    );
  }
  
  return (
    <View>          
      <View style={styles.container}>
        <View style={styles.checkboxContainer}>
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
          style={styles.button}
          onPress = {() => {recenter()}}
        >
          <View style={styles.productImageContainer}>
            <Image source={getImageSource(product?.images)} style={{width: 50, height: 65, resizeMode: 'stretch'}} />
          </View>
          <View style={styles.productDataContainer}>       
            <View style={styles.productNameContainer}>
                <Text style={styles.productNameText} numberOfLines={2}>{product?.name}</Text>
              <View style={styles.dataContainer}>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}><Price amount={product?.price} /></Text>
                </View>
                <View style={styles.compareAtPriceContainer}>
                  <Text style={styles.compareAtPriceText}>{product?.compareAtPrice > 0 ? <Price amount={product?.compareAtPrice} /> : ""}</Text>
                </View>
              </View>
              <View style={styles.dataContainer}>
                <View style={styles.variantContainer}>
                  <Text style={styles.variantText}>Variation: {product?.variant || "None"}</Text>
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
              <RenderQuantity />

              {product?.enabled != 1 &&
                <View style={styles.enabledContainer}>
                  <View style={styles.enabledSubContainer}>
                    <Text style={styles.enabledText}>Product not available</Text>
                  </View>
                </View>              
              }

              {product?.enabled == 1 && product?.contSellingIsset === 0 && product?.noOfStocks <= 0 &&
                <View style={styles.stockContainer}>
                  <View style={styles.stockSubContainer}>
                    <Text style={styles.stockText}>Out of Stock</Text>
                  </View>
                </View>              
              }

            </View>
          </View>
        </TouchableOpacity>

      </View>
      <View style={styles.margin} />
		</View>
  )
}

const styles = StyleSheet.create({
  renderQuantity: {
    flexDirection: 'row', 
    marginTop: 7, 
    alignItems: 'center', 
    height: 40
  },
  renderQuantityText: {
    fontFamily: FONT.REGULAR, 
    fontSize: 12
  },
  minusButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 25,
    width: 25,
    borderWidth: 1,
    borderColor: '#F8F8F8',
  },
  qtyContainer: {
    backgroundColor: '#F8F8F8',
    padding: 2,
    height: 25,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F8F8F8',
  },
  qtyText: {
    fontSize: 12
  },
  plusButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 25,
    width: 25,
    borderWidth: 1,
    borderColor: '#F8F8F8',
  },
  container: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 15
  },
  checkboxContainer: {
    flex: 0, 
    justifyContent: 'center'
  },
  button: {
    flex: 1, 
    flexDirection: 'row'
  },
  productImageContainer: {
    flex: 3, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  productDataContainer: {
    flex: 9, 
    justifyContent: 'center', 
    flexDirection: 'row'
  },
  productNameContainer: {
    flex: 1, 
    justifyContent: 'center'
  },
  productNameText: {
    fontSize: 13, 
    fontWeight: '100'
  },
  dataContainer: {
    flexDirection: 'row'
  },
  priceContainer: {
    flex: 0
  },
  priceText: {
    fontSize: 13, 
    color: "#F6841F"
  },
  compareAtPriceContainer: {
    flex: 0, 
    paddingHorizontal: 15, 
    justifyContent: 'center'
  },
  compareAtPriceText: {
    color: "#9E9E9E", 
    textDecorationLine: 'line-through', 
    fontSize: 10
  },
  variantContainer: {
    flex: 1
  },
  variantText: {
    color: "#9E9E9E", 
    fontSize: 13
  },
  enabledContainer: {
    paddingVertical: 15
  },
  enabledSubContainer: {
    borderWidth: 0.5, 
    borderColor: '#F6841F', 
    width: '50%', 
    alignItems: 'center', 
    borderRadius: 2
  },
  enabledText: {
    fontSize: 11, 
    color: "#F6841F"
  },
  stockContainer: {
    paddingVertical: 15
  },
  stockSubContainer: {
    borderWidth: 0.5, 
    borderColor: '#F6841F', 
    width: '35%', 
    alignItems: 'center', 
    borderRadius: 2
  },
  stockText: {
    fontSize: 11, 
    color: "#F6841F"
  },
  margin: {
    height: 2, 
    backgroundColor: '#F7F7FA'
  }
})