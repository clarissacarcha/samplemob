import React from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { FONT } from '../../../../../res/variables';
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { GET_BUY_AGAIN } from '../../../../../graphql/toktokmall/model';
import { ApiCall } from '../../../../helpers';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-community/async-storage';

const getAccessToken = async () => { 
  const accessToken = await AsyncStorage.getItem('accessToken');
  return accessToken
}

export const RenderBuyAgain = ({ navigation, data, onPressBuy: parentBuyOnpress }) => {

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
                quantity: item.quantity
              }
              itemsToBeSelected.push(item.productid);
              const req = await ApiCall("insert_cart", variables, true);
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
              let variables = {
                userid: item.userid,
                shopid: data?.orders?.shopId,
                branchid: item.branchid,
                productid: item.productid,
                quantity: item.quantity
              }
              itemsToBeSelected.push(item.productid);
              const req = await ApiCall("update_cart", variables, true);
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