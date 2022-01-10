import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, FlatList, RefreshControl, ScrollView} from 'react-native';

import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { GET_ORDER_DETAILS } from '../../../../../graphql/toktokmall/model';
import {Loading} from '../../../../Components';
import {placeholder, storeIcon} from '../../../../assets';
import { FormatDateTime, FormatToText, Price } from '../../../../helpers';
import AsyncStorage from '@react-native-community/async-storage';
import { FONT } from '../../../../../res/variables';
import CustomIcon from "../../../../Components/Icons";
import moment from 'moment';
import DashedLine from 'react-native-dashed-line';

const Store = ({data}) => {

  console.log("store data", data)

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

  const grandTotal = parseFloat(data?.shipping?.deliveryAmount) + parseFloat(data?.totalAmount)

  return (
    <>
      <View style={{flex: 1, flexDirection: 'row', paddingTop: 20, paddingHorizontal: 15}}>
        <View style={{flex: 1.5}}>
          <Text style={{fontSize: 13, fontFamily: FONT.BOLD}}>Order #:</Text>
        </View>
        <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
          <Text style={{color: "#9E9E9E", fontSize: 12}}>Order Placed: </Text>
        </View>
      </View>
      <View style={{flex: 1, flexDirection: 'row', paddingTop: 0, paddingBottom: 20, paddingHorizontal: 15}}>
        <View style={{flex: 1.5}}>
          <Text style={{fontSize: 13, fontFamily: FONT.BOLD}}>{data?.referenceNum}</Text>
        </View>
        <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
          <Text style={{color: "#9E9E9E", fontSize: 12}}>{data?.formattedDateOrdered} </Text>
        </View>
      </View>
      <View style={{ height: 2, backgroundColor: '#F7F7FA'}} />
      <View style={{flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 15}}>
        <View style={{flex: 1}}>
          <Text style={{color: "#9E9E9E", fontSize: 13}}>Delivery Fee:</Text>
          <Text style={{color: "#9E9E9E", fontSize: 13}}>Order Total: </Text>
        </View>
        <View styl={{flex: 1}}>
          <Text style={{color: "#222222", fontSize: 13}}><Price amount={data?.shipping?.deliveryAmount} /></Text>
          <Text style={{color: "#222222", fontSize: 13}}><Price amount={data?.totalAmount} /></Text>
        </View>
      </View>
      <View style={{ height: 2, backgroundColor: '#F7F7FA'}} />
      <View style={{flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 15}}>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 17, fontFamily: FONT.BOLD, color: "#F6841F"}}>Total</Text>
        </View>
        <View styl={{flex: 1}}>
        <Text style={{color: "#F6841F", fontSize: 17, fontFamily: FONT.BOLD}}><Price amount={grandTotal} /></Text>
        </View>
      </View>
      <View style={{ height: 8, backgroundColor: '#F7F7FA'}} />
    </>
  )
}

const History = ({data}) => {

  console.log("HIstory", data.orderHistory)

  const statuses = [
    {state: "Preparing Order", value: data.dateOrderProcessed},
    {state: "Order is ready to be picked up", value: data.dateReadyPickup},
    {state: "Booking order is confirmed", value: data.dateBookingConfirmed},
    {state: "Order is ready to be delivered", value: data.dateFulfilled},
    {state: "Order delivered", value: data.dateShipped}
  ]

  // const statuses = []

  // data?.orderHistory && data.orderHistory?.map((item, index) => {
        
  //   let existing = statuses.findIndex((a) => a.action === item.action)
  //   if(existing > -1){
  //     return
  //   }

  //   if(item.action == "Process Order"){
  //     statuses.push({state: "Preparing Order", value: item.dateCreated, ...item})
  //   }else if(item.action == "Ready for Pickup"){
  //     statuses.push({state: "Order is ready to be picked up", value: item.dateCreated, ...item})
  //   }else if(item.action == "Item picked up"){
  //     statuses.push({state: "Order has been picked up", value: item.dateCreated, ...item})
  //   }else if(item.action == "Mark as Fulfilled"){
  //     statuses.push({state: "Order is ready to be delivered", value: item.dateCreated, ...item})
  //   }else if(item.action == "Order Confirmed"){
  //     statuses.push({state: "Order delivered", value: item.dateCreated, ...item})
  //   }
    
  // })

  const RenderRow = ({rows, item, index, active, value}) => {

    const stateColor = active ? "#F6841F" : "#CCCCCC"
    
    return (
      <>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.5, flexDirection: 'column'}}>          
            <View style={{alignItems: 'center'}}>
              <CustomIcon.FA5Icon name="stop" size={2} color={"#ccc"} style={{marginVertical: 1, marginHorizontal: 2}} />
              <CustomIcon.FA5Icon name="stop" size={2} color={"#ccc"} style={{marginVertical: 1, marginHorizontal: 2}} />
              <CustomIcon.FA5Icon name="stop" size={2} color={"#ccc"} style={{marginVertical: 1, marginHorizontal: 2}} />
              <CustomIcon.FA5Icon name="stop" size={2} color={"#ccc"} style={{marginVertical: 1, marginHorizontal: 2}} />
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <CustomIcon.MCIcon name="circle" size={9} color={stateColor} style={{}} />
            </View>
            <View style={{alignItems: 'center'}}>
              {index < rows - 1 ?
                <>
                  <CustomIcon.FA5Icon name="stop" size={2} color={"#ccc"} style={{marginVertical: 1, marginHorizontal: 2}} />
                  <CustomIcon.FA5Icon name="stop" size={2} color={"#ccc"} style={{marginVertical: 1, marginHorizontal: 2}} />
                  <CustomIcon.FA5Icon name="stop" size={2} color={"#ccc"} style={{marginVertical: 1, marginHorizontal: 2}} />
                </> :
                <>
                  <CustomIcon.FA5Icon name="stop" size={2} color={"#fff"} style={{marginVertical: 1, marginHorizontal: 2}} />
                  <CustomIcon.FA5Icon name="stop" size={2} color={"#fff"} style={{marginVertical: 1, marginHorizontal: 2}} />
                  <CustomIcon.FA5Icon name="stop" size={2} color={"#fff"} style={{marginVertical: 1, marginHorizontal: 2}} />
                </>
              }
            </View>
          </View>
          <View style={{flex: 3, justifyContent: 'center'}}>
            <Text style={{fontSize: 13, color: active ? "#F6841F" : "#929191"}}>{item.state}</Text>
          </View>
          <View style={{flex: 2, paddingHorizontal: 15, justifyContent: 'center', alignItems: 'flex-end'}}>
            <Text style={{fontSize: 12, color: "#929191"}}>{value}</Text>
          </View>
        </View>
      </>
    )
  }

  return (
    <>
      <View style={{flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 15}}>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 13, fontFamily: FONT.BOLD}}>Delivery Status</Text>
        </View>
      </View>
      <View style={{ height: 2, backgroundColor: '#F7F7FA'}} />
      <View style={{height: 20}} />
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 0.5, flexDirection: 'column'}}>
          <View style={{alignItems: 'center'}}>
            <CustomIcon.FA5Icon name="stop" size={2} color={"#fff"} style={{marginVertical: 1, marginHorizontal: 2}} />
            <CustomIcon.FA5Icon name="stop" size={2} color={"#fff"} style={{marginVertical: 1, marginHorizontal: 2}} />
          </View>    
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <CustomIcon.MCIcon name="circle" size={9} color={"#F6841F"} style={{}} />
          </View>
          <View style={{alignItems: 'center'}}>
            <CustomIcon.FA5Icon name="stop" size={2} color={"#ccc"} style={{marginVertical: 1, marginHorizontal: 2}} />
            <CustomIcon.FA5Icon name="stop" size={2} color={"#ccc"} style={{marginVertical: 1, marginHorizontal: 2}} />
          </View>
        </View>
        <View style={{flex: 3, justifyContent: 'center'}}>
          <Text style={{fontSize: 13, color: "#F6841F"}}>Order Confirmed</Text>
        </View>
        <View style={{flex: 2, justifyContent: 'center', paddingHorizontal: 15, alignItems: 'flex-end'}}>
          <Text style={{fontSize: 12, color: "#929191"}}>{FormatDateTime(data.dateOrdered)}</Text>
        </View>
      </View>
      <FlatList 
        data={statuses}
        renderItem={({item, index}) => {

          let value = ""

          if(item.value == "Invalid date" || item.value == undefined){
            value = ""
          }else{
            value = `${FormatDateTime(item.value)}`
          }

          return (
            <RenderRow 
              rows={statuses.length} 
              item={item} 
              index={index} 
              active={value != ""}
              value={value}
            />
          )

        }}
      />
      
    </>
  )
  
}

const Item = ({data}) => {

  let product = data?.product

  const getImageSource = (img) => {
    if(typeof img == "object" && img?.filename != null){
      return {uri: img.filename}
    }else {
      return placeholder
    }
  }

  return (
    <>
      <View style={{flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 15}}>
        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, borderRadius: 5}}>
          <Image source={getImageSource(product?.img)} style={{width: 55, height: 80, resizeMode: 'stretch', borderRadius: 5}} />
        </View>
        <View style={{flex: 8}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View>
              <Text style={{fontSize: 13, fontWeight: '100'}} numberOfLines={2}>{product?.name ? product?.name : product?.itemname}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0}}>
                <Text style={{fontSize: 13, color: "#F6841F"}}><Price amount={data?.totalAmount} /></Text>
              </View>
              <View style={{flex: 0, paddingHorizontal: 10}}>
                <Text style={{color: "#9E9E9E", textDecorationLine: 'line-through', fontSize: 11}}>{parseFloat(data?.product?.compareAtPrice) > 0 ? <Price amount={data?.product?.compareAtPrice} /> : null}</Text>
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

export const Renderer = ({id, email}) => {

  const [data, setData] = useState([])

  const [getOrderDetails, {loading, error}] = useLazyQuery(GET_ORDER_DETAILS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      if(response.getOrderDetails){
        // console.log('order details',response.getOrderDetails)
        setData(response.getOrderDetails)
      }
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

  useEffect(() => {    
    console.log("order id", id)
    getOrderDetails({variables: {
      input: {
        orderId: id
      }
    }})
    
  }, [])

  if(loading) {
    return <Loading state={loading} />
  }

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Store data={data?.shipping?.store} />
        {data && data?.orderData?.length > 0 && data?.orderData?.map((raw, i) => <Item key={i} data={raw} />)}
        <Summary data={data} />
        <History data={data} />
      </ScrollView>
    </>
  )

};
