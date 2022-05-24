import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { FONT } from '../../../../../res/variables';
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { GET_MY_CART, GET_BUY_AGAIN, CHECK_ITEM_FROM_CART  } from '../../../../../graphql/toktokmall/model';
import { ApiCall, getRefComAccountType} from '../../../../helpers';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-community/async-storage';
import {useSelector} from 'react-redux';

const getAccessToken = async () => { 
  const accessToken = await AsyncStorage.getItem('accessToken');
  return accessToken
}

export const RenderBuyAgain = ({ navigation, data, onPressBuy: parentBuyOnpress }) => {

  const session = useSelector(state=>state.session)
  const [qty, setQty] = useState(0)

  const [getMyCartData, {loading, error}] = useLazyQuery(GET_MY_CART, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      // console.log('response', response.getMyCart.parsed)
      response.getMyCart.parsed.map(order => {
        order.data.map(item => {
          if(data?.orders?.items[0]?.productId === item?.product?.Id) {
            // console.log("DAAATAAA",item.quantity)
            setQty(item.quantity)
          }
            
        })
      }) 
    },
    onError: (err) => {
      console.log("lOG",err)
    }
  })

  const [getBuyAgain] = useLazyQuery(GET_BUY_AGAIN, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    context: { headers: { authorization: "Bearer: " + getAccessToken() }},  
    onCompleted: (response) => {
      // console.log("response.getBuyAgain",response.getBuyAgain)
      if(response.getBuyAgain) { 
        const itemsToBeSelected = [];
        const { toaddItems, toupdateItems } = response.getBuyAgain;
        if(toaddItems?.length > 0) {
          toaddItems?.map(async (item, index) => {
            try {
              let variables = {
                userid: item.userid,
                shopid: data?.orders?.shopId,
                branchid: item.branchid,
                productid: item.productid,
                quantity: item.quantity
              }
              itemsToBeSelected.push(item.productid);
              const req = await ApiCall("insert_cart", variables, true);
              // console.log("GAGAGAG",req)
              if(req) {
                if(index === toaddItems?.length - 1 && toupdateItems?.length === 0) {
                  parentBuyOnpress();
                  navigation.navigate("ToktokMallMyCart", {items: itemsToBeSelected});
                  EventRegister.emit('refreshToktokmallShoppingCart');
                }
              }
            } catch (err) {
              console.log(err)
            } 
          })
        }

        if(toupdateItems?.length > 0) {
          toupdateItems?.map(async (item, index) => {
            try {
              const quantity = await getQuantity(item);

              let variables = {
                userid: item.userid,
                shopid: data?.orders?.shopId,
                branchid: item.branchid,
                productid: item.productid,
                quantity: quantity
              }
              itemsToBeSelected.push(item.productid);
              const req = await ApiCall("update_cart", variables, true);

              // console.log("GAGAGAG",req)
              if(req) {
                if(index === toupdateItems?.length - 1) {
                  parentBuyOnpress();
                  navigation.navigate("ToktokMallMyCart", {items: itemsToBeSelected});
                  EventRegister.emit('refreshToktokmallShoppingCart');                  
                }
              }
            } catch (err) {
              console.log(err)
            } 
          })
        }
      } 
    },
    onError: (err) => {
      console.log(err)
    }
  });

  useEffect(() => {
    // console.log("datadatadatadata",data?.orders?.items[0]?.productId)
    getMyCartData({
      variables: {
        input: {
          refCom: getRefComAccountType({session})
        }
      }
    }) 
  },[])

  
  const getQuantity = async (item) => {
    const { userid, productid, quantity } = item;
    const { data: { checkItemFromCart } } = await TOKTOK_MALL_GRAPHQL_CLIENT.query({
        query: CHECK_ITEM_FROM_CART,
        variables: {
          input: {
            userId: userid,
            productId: productid
          }
        }
    })

    const { quantity: itemQuantity } = checkItemFromCart;
    const newQuantity = parseInt(itemQuantity) + parseInt(quantity);
    return newQuantity;
  }

  onPressBuy = () => {
    parentBuyOnpress();
    const { items } = data?.orders;
    getBuyAgain({variables: {
      input: {
        items: items
      }
    }})
  }
  
  return data?.status?.status === 4 ||  data?.status?.status === 5?
    <View style={styles.container}> 
        <TouchableOpacity style={styles.buyAgainButton} onPress={onPressBuy} >
            <Text style={styles.buyAgainText}>Buy Again</Text>
        </TouchableOpacity>
    </View>
  : <></>
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth:.50,
        borderTopColor:'rgba(0, 0, 0, 0.25)',
        paddingVertical: 15,
        paddingHorizontal: 32,

    },
    buyAgainButton: {
      height: 40,
      backgroundColor: "#F6841F",
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center'
    },
    buyAgainText: {
      color: "#fff", 
      fontSize: 13,
      fontWeight: "600",
      fontFamily: FONT.BOLD,
      lineHeight:16
    },
  }) 