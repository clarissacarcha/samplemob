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
  state = false, 
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
  const [product, setproduct] = useState({})

  useEffect(() => {
    setQty(data.quantity)
    setproduct(data.product)
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
    if(imgs && typeof imgs == "string"){
      return {uri: imgs}
    }else {
      return placeholder
    }
  }
  
  return (
    <TouchableOpacity onLongPress={() => {
      onHold({
        checked: !selected,
        item: product,
        amount: product.price * data.quantity,
        qty: qty,
        index: index,
        storeIndex: storeIndex
      })
      onPress()
    }}>          
      <View style={styles.container}>
        <View style={styles.checkboxContainer}>
          <CheckBox
            isChecked={selected}
            checkedCheckBoxColor="#F6841F"
						uncheckedCheckBoxColor="#F6841F"
						onClick={() => {							
							onSelect({
                checked: !selected,
                item: product,
                amount: product.price * data.quantity,
                qty: qty,
                index: index,
                storeIndex: storeIndex, 
                id: data.id
              })
              // if()
              // setSelected(!selected)
              onPress()
              // deleteItem(data.item_id)
						}}
					/>
        </View>
				<View style={styles.imgContainer}>
					<Image source={getImageSource(product?.img?.filename)} style={styles.img} />
				</View>
        <View style={styles.infoContainer}>       
          <View style={styles.infoSubContainer}>
            <Text style={styles.infoItemNameText} numberOfLines={2}>{product?.itemname}</Text>
						<View style={styles.flexDirection}>
              <View style={styles.flex0}>
								<Text style={styles.priceText}><Price amount={product?.price} /></Text>
              </View>
							<View style={styles.compareAtPriceContainer}>
								<Text style={styles.compareAtPriceText}>{product?.compareAtPrice > 0 ? <Price amount={product?.compareAtPrice} /> : ""}</Text>
              </View>
            </View>
            <View style={styles.flexDirection}>
              <View style={styles.flex1}>
                <Text style={styles.variationText}>Variation: {data?.variation || "None"}</Text>
              </View>
              {/* <View style={{flex: 0}}>
                <Text style={{color: "#9E9E9E", fontSize: 13}}>Qty: {data?.qty}</Text>
              </View> */}
            </View>
            <View style={styles.subContainer}>
              <Text style={styles.qtyTitleText}>Qty</Text>
              <TouchableOpacity 
                style = {styles.minusButton}
                disabled = {qty == 1}
                onPress = {() => {
                  onChangeQuantity(qty - 1, data?.id)
                  setQty(qty - 1)
                }}
              >
                <AIcons
                  name = {'minus'}
                  size = {18}
                  color = {qty == 1 ? '#D7D7D7':  COLOR.ORANGE}
                />
              </TouchableOpacity>
              <View style={styles.qtyText}>
                <Text>{qty}</Text>
              </View>
              <TouchableOpacity
                style = {styles.plusButton}
                disabled={product.noOfStocks === qty || qty === 200}
                onPress = {() => {
                  onChangeQuantity(qty + 1, data?.id)
                  setQty(qty + 1)
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
      </View>
      <View style={styles.margin1} />
						</TouchableOpacity>
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
  imgContainer: {
    flex: 3, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  img: {
    width: 50, 
    height: 65, 
    resizeMode: 'stretch'
  },
  infoContainer: {
    flex: 9, 
    justifyContent: 'center', 
    flexDirection: 'row'
  },
  infoSubContainer: {
    flex: 1, 
    justifyContent: 'center'
  },
  infoItemNameText: {
    fontSize: 13, 
    fontWeight: '100'
  },
  flexDirection: {
    flexDirection: 'row'
  },
  flex0: {
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
  flex1: {
    flex: 1
  },
  variationText: {
    color: "#9E9E9E", 
    fontSize: 13
  },
  subContainer: {
    flexDirection: 'row', 
    marginTop: 7, 
    alignItems: 'center', 
    height: 40
  },
  qtyTitleText: {
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
    borderColor: '#F8F8F8'
  },
  qtyText: {
    backgroundColor: '#F8F8F8', 
    padding: 5, 
    height: 25,width: 35, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1, 
    borderColor: '#F8F8F8'
  },
  plusButton: {
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 25,
    width: 25,
    borderWidth: 1, 
    borderColor: '#F8F8F8'
  },
  margin1: {
    height: 2, 
    backgroundColor: '#F7F7FA'
  }
})