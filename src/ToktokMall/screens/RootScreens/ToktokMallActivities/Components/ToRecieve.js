import React, {useState, useEffect} from 'react';
import {
  View, 
  Text, 
  Image, 
  FlatList,
  RefreshControl, 
  Dimensions,
  StyleSheet
} from 'react-native';
import { RenderItem } from './subComponents';
import { emptyorders } from '../../../../assets';
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { GET_TRANSACTIONS } from '../../../../../graphql/toktokmall/model';
import { Loading } from '../../../../Components';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

export const ToRecieveItem = ({fulldata}) => {
  const navigation = useNavigation();

  const onPressCard = () => {
    navigation.navigate("ToktokMallOrderDetails", {...fulldata, orderId: fulldata.id})
  }

  return <RenderItem 
    onPressCard={onPressCard}
    fulldata={fulldata}
  />
}

export const ToRecieve = () => {
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
      if(response.getActivities){
        const newActivities = [...response.getActivities.filter(activity => activity.status.status === 3)];
        setData(newActivities)
      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const renderItem = ({item}) => {
    return (
      <ToRecieveItem 
        fulldata={item}
      />
    )
  }

  const Fetch = async () => {
    AsyncStorage.getItem("ToktokMallUser").then((raw) => {
      let data = JSON.parse(raw)
      if(data.userId){        
        getOrders({variables: {
          input: {
            refCom: "",
            filter: 3
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