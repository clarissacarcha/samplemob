import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, FlatList, RefreshControl} from 'react-native';

import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { GET_TOSHIP_ORDERS } from '../../../../../graphql/toktokmall/model';
import {Loading} from '../../../../Components';
import {placeholder, storeIcon} from '../../../../assets';
import { Price } from '../../../../helpers';
import AsyncStorage from '@react-native-community/async-storage';

const Store = ({data}) => {
  return (
    <>
      <View style={{flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 20}}>
        <View style={{flex: 0}}>
          <Image source={storeIcon} style={{width: 24, height: 24, resizeMode: 'stretch'}} />
        </View>
        <View style={{flex: 1, paddingHorizontal: 7.5, justifyContent: 'center'}}>
          <Text style={{fontSize: 14}}>{data.shopname}</Text>
        </View>
      </View>
      <View style={{ height: 2, backgroundColor: '#F7F7FA'}} />
    </>
  )
}

const Summary = ({data}) => {
  return (
    <>
      <View style={{flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 15}}>
        <View style={{flex: 1}}>
          <Text style={{color: "#9E9E9E", fontSize: 12}}>Order #: {data?.referenceNum}</Text>
          <Text style={{color: "#9E9E9E", fontSize: 12}}>Order Placed: {data?.shipping?.orderPlaced} </Text>
        </View>
        <View styl={{flex: 1}}>
          <Text style={{fontSize: 14}}>Order Total: <Text style={{color: "#F6841F", fontSize: 14}}><Price amount={data?.totalAmount} /></Text></Text>
        </View>
      </View>
      <View style={{ height: 8, backgroundColor: '#F7F7FA'}} />
    </>
  )
}

const Item = ({data}) => {

  let product = data?.product

  const getImageSource = (img) => {
    if(typeof img == "object" && img.filename != null){
      return {uri: img.filename}
    }else {
      return placeholder
    }
  }

  return (
    <>
      <View style={{flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 15}}>
        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, borderRadius: 5}}>
          <Image source={getImageSource(product?.image || product?.img)} style={{width: 55, height: 80, resizeMode: 'stretch', borderRadius: 5}} />
        </View>
        <View style={{flex: 8}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View>
              <Text style={{fontSize: 13, fontWeight: '100'}}>{product?.itemname}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0}}>
                <Text style={{fontSize: 13, color: "#F6841F"}}><Price amount={data?.totalAmount} /></Text>
              </View>
              <View style={{flex: 0, paddingHorizontal: 10}}>
                <Text style={{color: "#9E9E9E", textDecorationLine: 'line-through', fontSize: 11}}>{parseFloat(data?.compareAtPrice) > 0 ? <Price amount={data?.compareAtPrice} /> : null}</Text>
              </View>
           </View>
            <View style={{flexDirection: 'row', paddingVertical: 5}}>
              <View style={{flex: 1.5}}>
                <Text style={{color: "#9E9E9E", fontSize: 13}}>Variation: {product?.variation || 'None'}</Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row-reverse'}}>
                <Text style={{color: "#9E9E9E", fontSize: 13}}>Qty: {data?.quantity}</Text>
              </View>
              <View style={{flex: 0.2}}></View>
            </View>
          </View>
        </View>        
      </View>
      <View style={{ height: 2, backgroundColor: '#F7F7FA'}} />
    </>
  )
}

const testdata = [{
  shop: {name: "Face Mask PH"},
  items: [{
    label: "Improved Copper Mask 2.0 White or Bronze",
    originalPrice: 380,
    price: 190,
    variation: "Black",
    qty: 1,
    image: ""
  }, {
    label: "Improved Copper Mask 2.0 White or Bronze",
    originalPrice: 380,
    price: 190,
    variation: "White",
    qty: 1,
    image: ""
  }],
  datePlaced: "6-14-21",
  orderNumber: "000X001",
  total: 460
}, {
  shop: {name: "The Apparel"},
  items: [{
    label: "Graphic Tees",
    originalPrice: 380,
    price: 190,
    variation: "White, L",
    qty: 1,
    image: ""
  }],
  datePlaced: "6-27-21",
  orderNumber: "000X002",
  total: 270
}]

export const ToShip = ({id, email}) => {

  const [data, setData] = useState([])

  const [getOrders, {loading, error}] = useLazyQuery(GET_TOSHIP_ORDERS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      if(response.getToShipOrders){
        setData(response.getToShipOrders)
      }
      console.log(response)
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const renderItem = ({item}) => {
    return (
      <>
        <Store data={item?.shipping?.shop} />
        {item.orderData.map((raw, i) => <Item key={i} data={raw} />)}
        <Summary data={item} />
      </>
    )
  }

  const Fetch = async () => {
    AsyncStorage.getItem("ToktokMallUser").then((raw) => {
      let data = JSON.parse(raw)
      if(data.userId){        
        getOrders({variables: {
          input: {
            userId: data.userId,
            email: data.email
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
