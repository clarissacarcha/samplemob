import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Platform } from 'react-native';
import { FONT } from '../../../../../res/variables';
import {placeholder} from '../../../../assets';
import { Price, FormatToText } from '../../../../helpers/formats';

import { useLazyQuery, useQuery, useMutation } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { GET_APPLY_VOUCHER } from '../../../../../graphql/toktokmall/model';
import CustomIcon from '../../../../Components/Icons';

import Spinner from 'react-native-spinkit';

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

export const Shops = ({raw, shipping, retrieve}) => {

  const [data, setData] = useState(raw || [])
  const [voucherIsValid, setVoucherIsValid] = useState(0)
  const [shopVoucher, setShopVoucher] = useState(null)
  const [vcode, setvcode] = useState("")

  const [validateShopVoucher, {error, loading}] = useLazyQuery(GET_APPLY_VOUCHER, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      console.log("Response", response)
      if(response.applyVoucher){

        setVoucherIsValid(2)
        setShopVoucher(response.applyVoucher)
        
      }else{
        setVoucherIsValid(-1)
        setVoucher(null)
      }
    },
    onError: (err) => {
      console.log(err)
      setVoucherIsValid(-1)
    }
  })

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
                <Text style ={{ color: '#9E9E9E' }}>Variation: {item.variation || "None"}</Text>
                <Text style ={{ color: '#9E9E9E'}}>Qty: {item.qty}</Text>
              </View>
            </View>
          </View>
        )
      })
  }  

  const renderVoucherForm = (item) => {
  
    return (
      <>
        <View>

          <View style={{
            flexDirection: 'row', 
            alignItems: 'center', 
            borderBottomWidth: 1, 
            paddingHorizontal: 5, 
            paddingVertical: 15, 
            borderBottomColor: '#F7F7FA'
          }}>
            <Text style = {{marginLeft: 10, fontFamily: FONT.BOLD}}>{item.store} vouchers</Text>
          </View>

          <View style={{paddingHorizontal: 15, paddingVertical: 15}}>

            {!loading && voucherIsValid == -1 && 
              <View style={{backgroundColor: '#FFFCF4', padding:10}}>
                <Text style={{color: '#F6841F', fontSize: 12, textAlign: 'center'}}>*Invalid voucher code. Please check your voucher code.</Text>
              </View>
            }

            <View style={{
              flex: 1,
              padding: Platform.OS === 'ios' ? 10 : 0,
              backgroundColor: '#F8F8F8',
              marginTop: 10,
              borderRadius: 5,              
              alignItems: 'flex-start',
              flexDirection: 'row'            
            }}>
              <TextInput
                value={vcode}
                style={{marginLeft: 10, flex: 1}}
                placeholder="Input voucher (optional)"
                autoCapitalize="characters"
                onChangeText={(val) => {
                  setvcode(val)
                  setVoucherIsValid(0)
                }}
              />
              <View style={{flex: 0.2, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  {loading && <Spinner 
                    isVisible={loading}
                    // isVisible={true}
                    type={"FadingCircleAlt"}
                    color={"#F6841F"}
                    size={15}
                  />}
                  {!loading && voucherIsValid == 2 && <CustomIcon.FeIcon name="check-circle" size={15} color="#06A44E" />}
                  {!loading && voucherIsValid == -1 && <CustomIcon.FA5Icon name="times-circle" size={15} color="#F6841F" />}
                </View>              
              </View>
              <TouchableOpacity 
                disabled={vcode == ""}
                onPress={() => {
                  if(vcode == "") return 
                  validateShopVoucher({variables: {
                    input: {
                      vcode: vcode,
                      shopId: item.store_id
                    }
                  }})
                }}
                style={{
                  flex: 0, 
                  paddingVertical: 15, 
                  paddingHorizontal: 15,
                  backgroundColor: 'white',
                  alignItems: 'flex-end'
                }}
              >
                <Text style={{color: vcode == "" ? "#9E9E9E" : "#F6841F", textAlign: 'right'}}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </>
    )
  }

  const renderShops = () => {

    return data.map((item, i) => {

      const getShopLogo = (logo) => {
        if(typeof logo == "string") return {uri: logo}
        else return require("../../../../assets/icons/store.png")
      }
      
      return(
        <>
        <View style={styles.container}>
          <View style ={{flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, padding: 15, borderBottomColor: '#F7F7FA'}}>
            <Image source={getShopLogo(item?.storeLogo || {})} style={{width: 18, height: 18, resizeMode: 'stretch'}} /> 
            <Text style = {{marginLeft: 10, fontFamily: FONT.BOLD}}>{item.store}</Text>
          </View>
          <View style={{padding: 15}}>
            {renderItems(item.cart)}
          </View>
          <View style={styles.deliveryfeeContainer}>
            <Text>Delivery Fee: {FormatToText.currency(shipping?.rateAmount || 0)}</Text>
            <Text>Order total ({item.cart.length} {item.cart.length > 1 ? `items` : 'item'}): {computeTotal(item.cart)} </Text>
            <Text style = {{marginTop: 7, color: '#929191'}}>Receive by: {shipping?.deliveryDate || "Add address to calculate"} </Text>
          </View>

          {renderVoucherForm(item)}

        </View>
        </>
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
  itemSaleOff: {textDecorationLine: 'line-through', color: '#9E9E9E', fontSize: 11, marginTop: 2},
  deliveryfeeContainer: {borderWidth: 1, borderColor: '#FDDC8C', marginLeft: 15, marginRight: 15, padding: 10, borderRadius: 5, marginBottom: 15,}
})