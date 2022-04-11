import React, { useState, useEffect } from 'react';
import {
  View, 
  Text, 
  Image, 
  FlatList, 
  RefreshControl, 
  Dimensions,
  StyleSheet
} from 'react-native';
import { emptyorders } from '../../../../assets';
import { RenderItem } from './subComponents';
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { 
  GET_BUY_AGAIN,
  GET_TRANSACTIONS
} from '../../../../../graphql/toktokmall/model';
import { useNavigation } from '@react-navigation/native';
import { Loading } from '../../../../Components';
import { ApiCall } from '../../../../helpers';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-community/async-storage';

const getAccessToken = async () => { 
  const accessToken = await AsyncStorage.getItem('accessToken');
  return accessToken
};

export const CancelledItem = ({fulldata, onPressBuy: parentBuyOnpress}) => {
  const navigation = useNavigation();

  const [getBuyAgain] = useLazyQuery(GET_BUY_AGAIN, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    context: { headers: { authorization: "Bearer: " + getAccessToken() }},  
    onCompleted: (response) => {
      if(response.getBuyAgain) { 
        const { toaddItems, toupdateItems } = response.getBuyAgain;
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
              const req = await ApiCall("insert_cart", variables, true);
              if(req) {
                if(index === toaddItems.length - 1 && toupdateItems.length === 0) {
                  parentBuyOnpress();
                  navigation.navigate("ToktokMallMyCart");
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
              let variables = {
                userid: item.userid,
                shopid: item.shopid,
                branchid: item.branchid,
                productid: item.productid,
                quantity: item.quantity
              }
              const req = await ApiCall("update_cart", variables, true);
              console.log(req)
              if(req) {
                if(index === toupdateItems.length - 1) {
                  parentBuyOnpress();
                  navigation.navigate("ToktokMallMyCart");
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

  onPressCard = () => {
    navigation.navigate("ToktokMallOrderDetails", {...fulldata, orderId: fulldata.id})
  }

  onPressBuy = () => {
    parentBuyOnpress();

    const { items } = fulldata.orders;

    getBuyAgain({variables: {
      input: {
        items: items
      }
    }})
  }

  return <RenderItem 
    onPressCard={onPressCard}
    onPressBuy={onPressBuy}
    fulldata={fulldata}
  />
}

export const Cancelled = (props) => {
  const [data, setData] = useState([]);

  const [getOrders, {loading, error}] = useLazyQuery(GET_TRANSACTIONS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    context: { headers: { authorization: "Bearer: " + getAccessToken() }},
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      if(response.getActivities){
        setData(response.getActivities)
      }
    },
    onError: (err) => {
      console.log(err)
    }
  });

  const renderItem = ({item}) => {
    return (
      <CancelledItem 
        fulldata={item}
        {...props}
      />
    )
  };

  const Fetch = async () => {
    getOrders({variables: {
      input: {
        refCom: "",
        filter: 5
      }
    }})
  };

  useEffect(() => {    
    Fetch()
  }, []);

  if(loading) {
    return <Loading state={loading} />
  }

  if(!loading && data && data.length == 0){
    return (
      <>
        <View style={styles.noDataContainer}>
          <Image source={emptyorders} style={styles.noDataImage} />
          <View style={styles.noDataTextContainer}>
            <Text style={styles.noDataTitle}>No Orders</Text>
    				<Text style={styles.noDataBody}>Go browse and checkout something you like</Text>
		    	</View>
        </View>
      </>
    )
  }

  return (
    <FlatList 
      data={data}
      contentContainerStyle={styles.flatlistStyle}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl 
          refreshing={loading}
          onRefresh={() => {
            Fetch()
          }}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  //Main Style
  flatlistStyle: {
    paddingVertical: 8
  },
  noDataContainer: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  noDataImage: {
    width: '80%', 
    height: Dimensions.get("screen").height / 4, 
    resizeMode: 'contain'
  },
  noDataTextContainer: {
    alignItems: 'center',
    marginTop: 8
  },
  noDataTitle: {
    fontSize: 18, 
    fontWeight: "600", 
    color: "#F6841F", 
    marginBottom: 8
  },
  noDataBody: {
    fontSize: 13, 
    fontWeight: "400", 
    color: "#000000"
  }
}) 