import React, { useState } from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { FONT } from '../../../res/variables';
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../graphql';
import { GET_BUY_AGAIN, CHECK_ITEM_FROM_CART  } from '../../../graphql/toktokmall/model';
import { ApiCall } from '../../helpers';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-community/async-storage';
import { LoadingOverlay } from './LoadingOverlay';
import { useNavigation } from '@react-navigation/native';

const getAccessToken = async () => { 
  const accessToken = await AsyncStorage.getItem('accessToken');
  return accessToken
}

export const BuyAgainButton = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigation = useNavigation();

  const [getBuyAgain] = useLazyQuery(GET_BUY_AGAIN, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    context: { headers: { authorization: "Bearer: " + getAccessToken() }},  
    onCompleted: (response) => {
      if(response.getBuyAgain) { 
        const itemsToBeSelected = [];
        const { toaddItems, toupdateItems } = response.getBuyAgain;
        
        console.log("getBuyAgain", toaddItems, toupdateItems)
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
      } 
    },
    onError: (err) => {
      console.log(err)
    }
  });

  onPressBuy = () => {
    const { items } = data?.orders;

    console.log("onPressBuy, getBuyAgain", JSON.stringify(items))
    setIsVisible(true);
    getBuyAgain({variables: {
      input: {
        items: items
      }
    }})
  }
  
  return (
        <>
          <TouchableOpacity style={styles.buyAgainButton} onPress={onPressBuy} >
              <Text style={styles.buyAgainText}>Buy Again</Text>
          </TouchableOpacity>
          <LoadingOverlay isVisible={isVisible} />
        </>
    )
}

const styles = StyleSheet.create({
  buyAgainButton: {
    marginHorizontal: 16,
    marginVertical: 16,
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