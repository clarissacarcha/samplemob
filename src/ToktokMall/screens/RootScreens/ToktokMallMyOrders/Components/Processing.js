import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, FlatList, RefreshControl, Dimensions} from 'react-native';

import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { GET_PROCESSING_ORDERS, GET_CONFIRMED_TRANSACTIONS } from '../../../../../graphql/toktokmall/model';
import {Loading} from '../../../../Components';
import {placeholder, storeIcon, emptyorders} from '../../../../assets';
import { Price } from '../../../../helpers';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';

const Store = ({data}) => {

  return (
    <>
      <View style={{flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 20}}>
        <View style={{flex: 0}}>
          <Image source={storeIcon} style={{width: 24, height: 24, resizeMode: 'stretch'}} />
        </View>
        <View style={{flex: 1, paddingHorizontal: 7.5, justifyContent: 'center'}}>
          <Text style={{fontSize: 14}}>{data?.shopname}</Text>
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
          <Text style={{color: "#9E9E9E", fontSize: 12}}>Order Placed: {data?.orderPlaced} </Text>
        </View>
        <View styl={{flex: 1}}>
          <Text style={{fontSize: 14}}>Order Total: <Text style={{color: "#F6841F", fontSize: 14}}><Price amount={data?.orderTotal} /></Text></Text>
        </View>
      </View>
      <View style={{ height: 8, backgroundColor: '#F7F7FA'}} />
    </>
  )
}

const Item = ({data, fulldata}) => {

  const navigation = useNavigation()
  let product = data?.product

  const getImageSource = (img) => {
    if(img && typeof img == "object" && img?.filename != null){
      return {uri: img.filename}
    }else {
      return placeholder
    }
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ToktokMallOrderDetails", {...fulldata, orderId: fulldata.id})
        }}
        style={{flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 15}}
      >
        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, borderRadius: 5}}>
          <Image source={getImageSource(product?.image || product?.img)} style={{width: 55, height: 80, resizeMode: 'stretch', borderRadius: 5}} />
        </View>
        <View style={{flex: 8}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View>
              <Text style={{fontSize: 13, fontWeight: '100'}} numberOfLines={2}>{product?.name ? product?.name : product?.itemname}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0}}>
                <Text style={{fontSize: 13, color: "#F6841F"}}><Price amount={product?.price} /></Text>
              </View>
              <View style={{flex: 0, paddingHorizontal: 10}}>
                <Text style={{color: "#9E9E9E", textDecorationLine: 'line-through', fontSize: 11}}>{parseFloat(product?.compareAtPrice) > 0 ? <Price amount={product?.compareAtPrice} /> : null}</Text>
              </View>
           </View>
            <View style={{flexDirection: 'row', paddingVertical: 5}}>
              <View style={{flex: 1.5}}>
                <Text style={{color: "#9E9E9E", fontSize: 13}}>Variation: {product?.variant || 'None'}</Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row-reverse'}}>
                <Text style={{color: "#9E9E9E", fontSize: 13}}>Qty: {data?.quantity}</Text>
              </View>
              <View style={{flex: 0.2}}></View>
            </View>
          </View>
        </View>        
      </TouchableOpacity>
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

export const Processing = ({id, email}) => {

  const [data, setData] = useState([])

  const [getOrders, {loading, error}] = useLazyQuery(GET_CONFIRMED_TRANSACTIONS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      if(response.getConfirmedTransactions){
        setData(response.getConfirmedTransactions)
      }
      console.log(response)
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const renderItem = ({item}) => {
    let items = item.items || []
    return (
      <>
        {items && items.length > 0 && items.map((data) => {

          return (
            <>
              <Store data={data.shop} />
              
              {data.products && data.products.length > 0 && data.products.map((order) => {

                return (
                  <>
                  {order.data.map((product, i) => {

                    return (
                      <>
                        <Item key={i} data={product} fulldata={item} />
                      </>
                    )
                  })}
                  </>
                )
                
              })}

            </>
          )
        })}
        {/* <Store data={item?.shipping?.shop} /> */}
        {/* {item.orderData.map((raw, i) => <Item key={i} data={raw} fulldata={item} />)} */}
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
            // userId: 9999,
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

  if(!loading && data && data.length == 0){
    return (
      <>
        <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
          <Image source={emptyorders} style={{width: '80%', height: Dimensions.get("screen").height / 4, resizeMode: 'contain'}} />
          <View style={{height: 8}} />
          <View>
    				<Text style={{fontSize: 16, color: "#9E9E9E"}}>You don’t have orders yet</Text>
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
