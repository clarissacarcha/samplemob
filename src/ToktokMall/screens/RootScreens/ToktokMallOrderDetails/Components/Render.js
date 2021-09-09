import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, FlatList, RefreshControl, ScrollView} from 'react-native';

import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { GET_ORDER_DETAILS } from '../../../../../graphql/toktokmall/model';
import {Loading} from '../../../../Components';
import {placeholder, storeIcon} from '../../../../assets';
import { FormatToText, Price } from '../../../../helpers';
import AsyncStorage from '@react-native-community/async-storage';
import { FONT } from '../../../../../res/variables';
import CustomIcon from "../../../../Components/Icons";

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

  const grandTotal = parseFloat(data?.shipping?.deliveryAmount) + parseFloat(data?.totalAmount)

  return (
    <>
      <View style={{flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 15}}>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 13, fontFamily: FONT.BOLD}}>Order #: {data?.referenceNum}</Text>
        </View>
        <View styl={{flex: 1}}>
        <Text style={{color: "#9E9E9E", fontSize: 12}}>Order Placed: {data?.shipping?.orderPlaced} </Text>
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

  const history = data?.orderHistory

  const getColor = (index) => {
    if(index == 0) return "#F6841F"
    if(!history || history.length == 0) return "#929191"
    if(history[index] != undefined || history[index] != null){
      return "#F6841F"
    }else{
      return "#929191"
    }
  }

  const getIconColor = (index) => {
    if(index == 0) return "#F6841F"
    if(!history || history.length == 0) return "#CCCCCC"
    if(history[index] != undefined || history[index] != null){
      return "#F6841F"
    }else{
      return "#CCCCCC"
    }
  }

  const getDateTime = (index) => {
    if(index == 0) return "--:--:-- 00:00 --"
    if(!history || history.length == 0) return ""
    if(history[index] != undefined || history[index] != null){
      return `${history[index].formatDate}, ${history[index].formatTime}`
    }else{
      return ""
    }
  }

  return (
    <>
      <View style={{flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 15}}>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 13, fontFamily: FONT.BOLD}}>Delivery Status</Text>
        </View>
      </View>
      <View style={{ height: 2, backgroundColor: '#F7F7FA'}} />
      <View style={{flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 15}}>
        <View style={{flex: 0.6}}>
          <View style={{paddingVertical: 12, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
            <CustomIcon.MCIcon name="circle" size={11} color={getIconColor(0)} style={{}} />
          </View>
          <View style={{paddingVertical: 12, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
            <CustomIcon.MCIcon name="circle" size={11} color={getIconColor(1)} style={{}} />
          </View>
          <View style={{paddingVertical: 12, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
            <CustomIcon.MCIcon name="circle" size={11} color={getIconColor(2)} style={{}} />
          </View>
          <View style={{paddingVertical: 12, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
            <CustomIcon.MCIcon name="circle" size={11} color={getIconColor(3)} style={{}} />
          </View>
          <View style={{paddingVertical: 12, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
            <CustomIcon.MCIcon name="circle" size={11} color={getIconColor(4)} style={{}} />
          </View>
          <View style={{paddingVertical: 12, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
            <CustomIcon.MCIcon name="circle" size={11} color={getIconColor(5)} style={{}} />
          </View>          
        </View>
        <View style={{flex: 0.2}} />
        <View style={{flex: 8}}>
          <View style={{paddingVertical: 8}}>
            <Text style={{color: getColor(0), fontSize: 13}}>Order confirmed</Text>
          </View>
          <View style={{paddingVertical: 8}}>
            <Text style={{color: getColor(1), fontSize: 13}}>Preparing order</Text>
          </View>
          <View style={{paddingVertical: 8}}>
            <Text style={{color: getColor(2), fontSize: 13}}>Order is ready to be picked up</Text>
          </View>
          <View style={{paddingVertical: 8}}>
            <Text style={{color: getColor(3), fontSize: 13}}>Order has been picked up</Text>
          </View>
          <View style={{paddingVertical: 8}}>
            <Text style={{color: getColor(4), fontSize: 13}}>Order is ready to be delivered</Text>
          </View>
          <View style={{paddingVertical: 8}}>
            <Text style={{color: "#929191", fontSize: 13}}>Order delivered</Text>
          </View>
        </View>
        <View styl={{flex: 1}}>
          <View style={{paddingVertical: 8}}>
            <Text style={{color: "#929191", fontSize: 13}}>{getDateTime(0)}</Text>
          </View>
          <View style={{paddingVertical: 8}}>
            <Text style={{color: "#929191", fontSize: 13}}>{getDateTime(1)}</Text>
          </View>
          <View style={{paddingVertical: 8}}>
            <Text style={{color: "#929191", fontSize: 13}}>{getDateTime(2)}</Text>
          </View>
          <View style={{paddingVertical: 8}}>
            <Text style={{color: "#929191", fontSize: 13}}>{getDateTime(3)}</Text>
          </View>
          <View style={{paddingVertical: 8}}>
            <Text style={{color: "#929191", fontSize: 13}}>{getDateTime(4)}</Text>
          </View>
          <View style={{paddingVertical: 8}}>
            <Text style={{color: "#929191", fontSize: 13}}></Text>
          </View>
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
          <Image source={getImageSource(product?.img)} style={{width: 55, height: 80, resizeMode: 'stretch', borderRadius: 5}} />
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

export const Renderer = ({id, email}) => {

  const [data, setData] = useState([])

  const [getOrderDetails, {loading, error}] = useLazyQuery(GET_ORDER_DETAILS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      if(response.getOrderDetails){
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

    getOrderDetails({variables: {
      input: {
        orderId: id
      }
    }})
    
  }, [])

  if(loading) {
    return <Loading state={loading} />
  }

  // return (
  //   <>
  //     <FlatList 
  //       data={data}
  //       renderItem={renderItem}
  //       refreshControl={
  //         <RefreshControl 
  //           refreshing={loading}
  //           onRefresh={() => {
  //             Fetch()
  //           }}
  //         />
  //       }
  //       showsVerticalScrollIndicator={false}
  //     />
  //   </>
  // );

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Store data={data?.shipping?.shop} />
        {data && data?.orderData?.length > 0 && data?.orderData?.map((raw, i) => <Item key={i} data={raw} />)}
        <Summary data={data} />
        <History data={data} />
      </ScrollView>
    </>
  )

};
