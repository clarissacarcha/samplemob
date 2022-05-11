import React, { useState, useEffect } from 'react';
import {
  View, 
  Text, 
  Image, 
  FlatList, 
  RefreshControl, 
  Dimensions
} from 'react-native';
import { 
  ProcessingItem,
  ToShipItem,
  ToRecieveItem,
  CompletedItem,
  CancelledItem
} from './'
import { Loading } from '../../../../Components';
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { GET_TRANSACTIONS } from '../../../../../graphql/toktokmall/model';
import { emptyorders} from '../../../../assets';
import AsyncStorage from '@react-native-community/async-storage';

export const All = () => {
  const [data, setData] = useState([]);

  const getAccessToken = async () => { 
    const accessToken = await AsyncStorage.getItem('accessToken');
    return accessToken
  }
  
  const [getOrders, {loading, error}] = useLazyQuery(GET_TRANSACTIONS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    context: { headers: { authorization: "Bearer: " + getAccessToken() }},
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      if(response.getActivities) {
        setData(response.getActivities);
      }
    },
    onError: (err) => {
      console.log(err)
    }
  });

  const renderItem = ({item}) => {
    const { status } = item;
    const orderStatus = status.status;
    switch (orderStatus) {
      case 1: 
        return (<ProcessingItem 
          fulldata={item}
        /> )
      case 2: 
        return (<ToShipItem 
          fulldata={item}
        /> )
      case 3: 
        return (<ToRecieveItem 
          fulldata={item}
        /> )
      case 4: 
        return (<CompletedItem 
          fulldata={item}
        /> )
      case 5: 
        return (<CancelledItem 
          fulldata={item}
        /> )
      default:
        return (<ProcessingItem 
          fulldata={item}
        /> )
    }
  }

  const Fetch = async () => {
    AsyncStorage.getItem("ToktokMallUser").then((raw) => {
      let data = JSON.parse(raw)
      if(data.userId){        
        getOrders({variables: {
          input: {
            refCom: "",
            filter: 0
          }
        }})
      }
    })
  }

  useEffect(() => {    
    Fetch()
  }, [])

  if(loading) {
    return <Loading state={loading} />
  }

  if(!loading && data && data.length == 0){
    return (
      <>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image source={emptyorders} style={{width: '80%', height: Dimensions.get("screen").height / 4, resizeMode: 'contain'}} />
          <View style={{height: 8}} />
          <View style={{alignItems: 'center'}}>
    				<Text style={{fontSize: 18, fontWeight: "600", color: "#F6841F", marginBottom: 8}}>No Orders</Text>
    				<Text style={{fontSize: 13, fontWeight: "400", color: "#000000"}}>Go browse and checkout something you like</Text>
		    	</View>
        </View>
        <View style={{flex: 0.2}} />
      </>
    )
  }

  return (
    <>
      <FlatList 
        data={data}
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
    </>
  );

};
