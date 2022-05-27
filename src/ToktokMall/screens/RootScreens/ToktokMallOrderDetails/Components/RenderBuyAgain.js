import React, { useState } from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { FONT } from '../../../../../res/variables';
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { GET_BUY_AGAIN, CHECK_ITEM_FROM_CART  } from '../../../../../graphql/toktokmall/model';
import { ApiCall } from '../../../../helpers';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-community/async-storage';
import { LoadingOverlay } from '../../../../Components';

const getAccessToken = async () => { 
  const accessToken = await AsyncStorage.getItem('accessToken');
  return accessToken
}

export const RenderBuyAgain = ({ navigation, data, status, onPressBuy: parentBuyOnpress }) => {

  const [isVisible, setIsVisible] = useState(false);

  const [getBuyAgain] = useLazyQuery(GET_BUY_AGAIN, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    context: { headers: { authorization: "Bearer: " + getAccessToken() }},  
    onCompleted: (response) => {
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
                quantity: item.quantity || 1
              }
              itemsToBeSelected.push(item.productid);
              const req = await ApiCall("insert_cart", variables, true);
              
              if(req) {
                if(index === toaddItems?.length - 1 && toupdateItems?.length === 0) {
                  setIsVisible(false);
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
              const newItem = await getExistingItem(item);

              let variables = {
                userid: item.userid,
                shopid: data?.orders?.shopId,
                branchid: item.branchid,
                productid: item.productid,
                quantity: newItem || 1
              }
              itemsToBeSelected.push(item.productid);
              const req = await ApiCall("update_cart", variables, true);

              
              if(req) {
                if(index === toupdateItems?.length - 1) {
                  setIsVisible(false);
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
  
  const getExistingItem = async (item) => {
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
    const { items } = data?.orders;

    setIsVisible(false);
    getBuyAgain({variables: {
      input: {
        items: items
      }
    }})
  }
  
  return data?.status?.status === 4 || status ?
    <View style={styles.footer}>
      <View style={styles.container}> 
        <TouchableOpacity style={styles.buyAgainButton} onPress={onPressBuy} >
            <Text style={styles.buyAgainText}>Buy Again</Text>
        </TouchableOpacity>

        <LoadingOverlay isVisible={isVisible} />
      </View>
    </View>
  : <></>
}

const styles = StyleSheet.create({
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      zIndex: 1,
    },
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