import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, } from 'react-native';
import { FONT } from '../../../../../res/variables';
import {placeholder} from '../../../../assets';
import { Price, FormatToText } from '../../../../helpers/formats';
// import { COLOR, FONT } from '../../../../../../res/variables';
// import {LandingHeader, AdsCarousel} from '../../../../../Components';
// import { ScrollView } from 'react-native-gesture-handler';
// import CustomIcon from '../../../../../Components/Icons';
// import {watch, electronics, mensfashion, furniture, petcare} from '../../../../../assets'
const testData = [
  {id: 1, full_name: 'Cloud Panda', contact_number: '09050000000',
    address: '10F, Inoza Tower, 40th Street, Bonifacio Global City', default: 1
  },
  {id: 2, full_name: 'Rick Sanchez', contact_number: '09060000000',
    address: 'B20 L1, Mahogany Street, San Isidro, Makati City', default: 0
  }
]

export const Shops = ({raw, shipping}) => {

  const [data, setData] = useState(raw || [])

  useEffect(() => {
    setData(raw)
  }, [raw])

  const computeTotal = (item) => {
    let total = 0
    for (let i = 0; i < item.length; i++){
      total = total + (parseFloat(item[i].price) * item[i].qty)
    }
    return FormatToText.currency(total)
  }

  const getImageSource = (imgs) => {
    if(typeof imgs == "object" && imgs.length > 0){
      return {uri: imgs[0].filename}
    }else {
      return placeholder
    }
  }

  const renderItems = (items) => {
    return items.map((item, i) => {
        return(
          <View style={styles.itemContainer}>
            <Image //source = {item.image} 
            source = {getImageSource(item.images)} 
            style ={styles.itemImage}/>
            <View style = {{ marginLeft: 15, flex: 1}}>
              <Text>{item.label}</Text>
              <View style = {{flexDirection: 'row'}}>
                <Text style ={styles.itemprice}>{FormatToText.currency(item.price)}</Text>
                <Text style ={styles.itemSaleOff}>{parseFloat(item.originalPrice) > 0 ? FormatToText.currency(item.originalPrice) : ""}</Text>
              </View>
              <View style = {{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                <Text style ={{ color: '#9E9E9E' }}>Variation: {item.variation || "No variation"}</Text>
                <Text style ={{ color: '#9E9E9E'}}>Qty: {item.qty}</Text>
              </View>
            </View>
          </View>
        )
      })
  }  
  // 

  const renderShops = () => {
    return data.map((item, i) => {
      return(
        <View style={styles.container}>
          <View style ={{flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, padding: 15, borderBottomColor: '#F7F7FA'}}>
            <Image source={require("../../../../assets/icons/store.png")} style={{width: 18, height: 18, resizeMode: 'stretch'}} /> 
            <Text style = {{marginLeft: 10, fontFamily: FONT.BOLD}}>{item.store}</Text>
          </View>
          <View style={{padding: 15}}>
            {renderItems(item.cart)}
          </View>
          <View style={styles.deliveryfeeContainer}>
            <Text>Delivery Fee: {FormatToText.currency(shipping?.rateAmount)}</Text>
            <Text>Order total ({item.cart.length} {item.cart.length > 1 ? `items` : 'item'}): {computeTotal(item.cart)} </Text>
            <Text style = {{marginTop: 7, color: '#929191'}}>Receive by: {shipping?.deliveryDate} </Text>
          </View>
        </View>
      )
    })
  }
    
  return (
    <>
      {/* <View style = {styles.container}>
       
      </View>   */}
      {data && data.length > 0 && renderShops()}
    </>
    )
}

const styles = StyleSheet.create({
  body: {flex: 1, backgroundColor: '#F7F7FA', },
  container: {padding: 0, backgroundColor: 'white', marginTop: 8,  },
  itemContainer: {flexDirection: 'row', justifyContent: 'flex-start'},
  itemImage: {flex: 0.3, height: 100, width: 100},
  itemprice: {color: '#F6841F', marginRight: 10},
  itemSaleOff: {textDecorationLine: 'line-through', color: '#9E9E9E'},
  deliveryfeeContainer: {borderWidth: 1, borderColor: '#FDDC8C', marginLeft: 15, marginRight: 15, padding: 10, borderRadius: 5, marginBottom: 15,}
})