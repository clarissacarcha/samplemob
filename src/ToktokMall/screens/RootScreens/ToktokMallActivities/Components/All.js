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
import { 
  ProcessingItem,
  ToShipItem,
  ToRecieveItem,
  CompletedItem,
  CancelledItem
} from './'
import { FONT_SIZE } from '../../../../../res/variables';
import { Loading } from '../../../../Components';
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { GET_TRANSACTIONS } from '../../../../../graphql/toktokmall/model';
import { emptyorders} from '../../../../assets';
import AsyncStorage from '@react-native-community/async-storage';

export const All = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAccessToken = async () => { 
    const accessToken = await AsyncStorage.getItem('accessToken');
    return accessToken
  }
  
  const [getOrders] = useLazyQuery(GET_TRANSACTIONS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      if(response.getActivities) {
        setData(response.getActivities);
        setTimeout(() => {
          setLoading(false);
        }, 1000)
      }
    },
    onError: (err) => {
      console.log(err);
      setLoading(false);
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
    setLoading(true);
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
        <View style={styles.noDataContainer}>
          <Image source={emptyorders} style={styles.noDataImage} />
          <View style={styles.noDataTextContainer}>
            <Text style={styles.noDataTitle}>No Orders</Text>
    				<Text style={styles.noDataBody}>Go browse and checkout something you like!</Text>
		    	</View>
        </View>
      </>
    )
  }

  return (
    <>
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
    </>
  );

};

const styles = StyleSheet.create({
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
    fontSize: FONT_SIZE.XL, 
    fontWeight: "600", 
    color: "#F6841F", 
    marginBottom: 8
  },
  noDataBody: {
    fontSize: FONT_SIZE.M, 
    fontWeight: "400", 
    color: "#000000"
  }
})