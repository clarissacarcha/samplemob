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

export const CancelledItem = ({fulldata}) => {
  const navigation = useNavigation();

  onPressCard = () => {
    navigation.navigate("ToktokMallOrderDetails", {...fulldata, orderId: fulldata.id, cancelled: true})
  }

  return <RenderItem 
    onPressCard={onPressCard}
    renderBuyAgain={true}
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
        const newActivities = [...response.getActivities.filter(activity => activity.status.status === 5)];
        setData(newActivities);
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
    				<Text style={styles.noDataBody}>Go browse and checkout something you like!</Text>
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