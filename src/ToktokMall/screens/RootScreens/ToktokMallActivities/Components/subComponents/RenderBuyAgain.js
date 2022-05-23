import React, { useState } from 'react';
import { 
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import { 
    GET_BUY_AGAIN, 
    CHECK_ITEM_FROM_CART 
} from '../../../../../../graphql/toktokmall/model';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../../graphql';
import { useLazyQuery } from '@apollo/react-hooks';
import { ApiCall } from '../../../../../helpers';
import { EventRegister } from 'react-native-event-listeners';
import { LoadingOverlay } from '../../../../../Components';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

const getAccessToken = async () => { 
    const accessToken = await AsyncStorage.getItem('accessToken');
    return accessToken
}

export const RenderBuyAgain = ({data}) => {
    const [isVisible, setIsVisible] = useState(false);
    const navigation = useNavigation();

    const [getBuyAgain] = useLazyQuery(GET_BUY_AGAIN, {
        client: TOKTOK_MALL_GRAPHQL_CLIENT,
        context: { headers: { authorization: "Bearer: " + getAccessToken() }},  
        onCompleted: (response) => {
            if(response.getBuyAgain) { 
                const itemsToBeSelected = [];
                const { toaddItems, toupdateItems } = response.getBuyAgain;
                console.log("toaddItems:" + JSON.stringify(toaddItems));
                console.log("toupdateItems:" + JSON.stringify(toupdateItems));

                if(toaddItems.length > 0) {
                    toaddItems.map(async (item, index) => {
                        try {
                            let variables = {
                                userid: item.userid,
                                shopid: item.shopid,
                                branchid: item.branchid,
                                productid: item.productid,
                                quantity: item.quantity
                            }

                            itemsToBeSelected.push(item.productid);
                                
                            const req = await ApiCall("insert_cart", variables, true);
                            if(req) {
                                if(index === toaddItems.length - 1 && toupdateItems.length === 0) {
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

                if(toupdateItems.length > 0) {
                    toupdateItems.map(async (item, index) => {
                        try {
                            const quantity = await getQuantity(item);

                            let variables = {
                                userid: item.userid,
                                shopid: item.shopid,
                                branchid: item.branchid,
                                productid: item.productid,
                                quantity: quantity
                            }

                            itemsToBeSelected.push(item.productid);

                            const req = await ApiCall("update_cart", variables, true);
                            if(req) {
                                if(index === toupdateItems.length - 1) {
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
        console.log("itemQuantity: " + newQuantity);
        return newQuantity;
    }

    const onPressBuy = () => {
        const { items } = data.orders;

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
        marginBottom: 16,
        height: 40,
        backgroundColor: "#F6841F",
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buyAgainText: {
        color: "#fff", 
        fontSize: 13,
        fontWeight: "600"
    },
})