import React, { useEffect, useState } from 'react'
import {View, Text, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {placeholder} from '../../../../assets';
import { Price } from '../../../../helpers';
import { FONT } from '../../../../../res/variables';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { CHECK_ITEM_FROM_CART  } from '../../../../../graphql/toktokmall/model';

export const RenderItem = ({data, navigation}) => {
  const[noOfStocks,setNoOfStocks] = useState()

  useEffect(() => {
    AsyncStorage.getItem("ToktokMallUser").then( async (raw) => {
      let user = JSON.parse(raw)
      const item = {
        userId: user.userId,
        productId: data.productId
      }

      await getQuantity(item)
    })
  }, [])

  const getQuantity = async (item) => {
    const { data: { checkItemFromCart:{ product } } } = await TOKTOK_MALL_GRAPHQL_CLIENT.query({
        query: CHECK_ITEM_FROM_CART,
        variables: {
          input: item
        }
    })
    return setNoOfStocks(product.noOfStocks)
  }

  const {data:{ itemname }, productId} = data
  
    let product = data?.data
    const getImageSource = (img) => {
      if(typeof img == "object" && img?.filename != null){
        return {uri: img.filename}
      }else {
        return placeholder
      }
    }
  
    return (
      <TouchableOpacity onPress={() => 
        // noOfStocks > 0 && navigation.navigate("ToktokMallProductDetails", { Id:productId, itemname })
        navigation.navigate("ToktokMallProductDetails", { Id:productId, itemname })
      } >
        <View style={{flexDirection: 'row',alignItems:'center' ,paddingVertical: 16, paddingHorizontal: 16}}>
          <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 5,paddingRight: 16}}>
            <Image source={getImageSource(product?.img)} style={{width: 50, height: 50, resizeMode: 'cover', borderRadius: 10}} />
          </View>
          <View style={{flex: 10,}}>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 13, fontWeight: '100'}} numberOfLines={2}>{product?.name ? product?.name : product?.itemname}</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row-reverse'}}>
                  <Text style={{color: "#F6841F", fontSize: 13, fontFamily: FONT.BOLD}}><Price amount={product?.price} /></Text>
                </View>
              </View>
  
              <View style={{flexDirection: 'row', paddingVertical: 5}}>
                <View style={{flex: 1}}>
                  <Text style={{color: "#525252", fontSize: 11}}>{product?.variant}</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row-reverse'}}>
                  <Text style={{ fontSize: 13, fontWeight: '100', color:'#525252'}}>
                    Qty: {data?.quantity}
                  </Text>
                </View>
              </View>
            </View>
          </View>        
        </View>
        <View style={{ height: 2, backgroundColor: '#F7F7FA', marginHorizontal:16}} />
      </TouchableOpacity>
    )
}
