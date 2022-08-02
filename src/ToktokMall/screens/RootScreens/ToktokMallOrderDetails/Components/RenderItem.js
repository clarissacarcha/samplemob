import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { placeholder } from '../../../../assets';
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
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image source={getImageSource(product?.img)} style={styles.images} />
          </View>
          <View style={{flex: 10,}}>
            <View style={styles.itemContainer}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {product?.name ? product?.name : product?.itemname}
                  </Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>
                    <Price amount={product?.price} />
                  </Text>
                </View>
              </View>
  
              <View style={styles.variantContainer}>
                <View style={{flex: 1}}>
                  <Text style={styles.variantText}>{product?.variant}</Text>
                </View>
                <View style={styles.qtyContainer}>
                  <Text style={styles.qtyText}>
                    Qty: {data?.quantity}
                  </Text>
                </View>
              </View>
            </View>
          </View>        
        </View>
        <View style={styles.line} />
      </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems:'center' ,
    paddingVertical: 16, 
    paddingHorizontal: 16
  },
  imageContainer: {
    flex: 2, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 5,
    paddingRight: 16
  },
  images: {
    width: 50, 
    height: 50, 
    resizeMode: 'cover', 
    borderRadius: 10
  },
  itemContainer: {
    flex: 1, 
    justifyContent: 'center'
  },
  itemName: {
    fontSize: 13, 
    fontWeight: '100'
  },
  priceContainer:{
    flex: 1, 
    flexDirection: 'row-reverse'
  },
  priceText: {
    color: "#F6841F", 
    fontSize: 13, 
    fontFamily: FONT.BOLD
  },
  variantContainer: {
    flexDirection: 'row', 
    paddingVertical: 5
  },
  variantText: {
    color: "#525252", 
    fontSize: 11
  },
  qtyContainer: {
    flex: 1, 
    flexDirection: 'row-reverse'
  },
  qtyText: {
    fontSize: 13, 
    fontWeight: '100', 
    color:'#525252'
  },
  line: {
    height: 2, 
    backgroundColor: '#F7F7FA', 
    marginHorizontal:16
  }
  
}) 