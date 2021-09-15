import { useNavigation } from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, FlatList, RefreshControl, Dimensions} from 'react-native';
import {HeaderTab, MessageModal, Loading} from '../../../../Components';
import CustomIcon from '../../../../Components/Icons';

import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { GET_COMPLETED_ORDERS } from '../../../../../graphql/toktokmall/model';
import {placeholder, storeIcon, emptyorders} from '../../../../assets';
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
          <Text style={{color: "#9E9E9E", fontSize: 12}}>Order Placed: {data?.formattedDateOrdered} </Text>
        </View>
        <View styl={{flex: 1}}>
          <Text style={{fontSize: 14}}>Order Total: <Text style={{color: "#F6841F", fontSize: 14}}><Price amount={data?.totalAmount} /></Text></Text>
          <Text style={{color: "#9E9E9E", fontSize: 12}}>Received: {data?.formattedDateReceived} </Text>
        </View>
      </View>
      <View style={{ height: 8, backgroundColor: '#F7F7FA'}} />
    </>
  )
}

const Item = ({data, fulldata}) => {

  const [messageModalShown, setMessageModalShown] = useState(false)
  const [rated, setRated] = useState(false)
  const navigation = useNavigation()

  let product = data?.product

  const getImageSource = (img) => {
    if(img && typeof img == "object" && img.filename != null){
      return {uri: img.filename}
    }else {
      return placeholder
    }
  }

  return (
    <>
      <TouchableOpacity 
        onPress={() => {
          navigation.navigate("ToktokMallOrderDetails", fulldata)
        }}
        style={{flexDirection: 'row', paddingTop: 10, paddingBottom: 0, paddingHorizontal: 15}}>
        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, borderRadius: 5}}>
          <Image source={getImageSource(product?.image || product?.img)} style={{width: 55, height: 80, resizeMode: 'stretch', borderRadius: 5}} />
        </View>
        <View style={{flex: 8}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View>
              <Text style={{fontSize: 13, fontWeight: '100'}} numberOfLines={2} ellipsizeMode="tail">{product?.itemname}</Text>
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
              <View style={{flex: 2.5}}>
                <Text style={{color: "#9E9E9E", fontSize: 13}}>Variation: {product?.variation || 'None'}</Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={{color: "#9E9E9E", fontSize: 13}}>Qty: {data.quantity}</Text>
              </View>
              <View style={{flex: 0.2}}></View>
            </View>
          </View>          
        </View>        
      </TouchableOpacity>
      
      {/* Comment this View for disabling rating */}
      <View style={{flexDirection: 'row-reverse', paddingHorizontal: 15, paddingBottom: 15}}>
        {!rated && 
        <TouchableOpacity 
          onPress={()=> {                    
            navigation.navigate("ToktokMallRateProduct", {
              orderData: {...fulldata, ...data},
              openModal: () => {
                setRated(true)
                setMessageModalShown(true)
              }
            })
        }}>
          <View style={{paddingVertical: 2, paddingHorizontal: 20, backgroundColor: '#F6841F', borderRadius: 5}}>
            <Text style={{color: "#fff", fontSize: 13}}>Rate</Text>
          </View>
        </TouchableOpacity>}
        {rated && 
        <TouchableOpacity onPress={() => {
          navigation.navigate("ToktokMallProductDetails", {Id: data.productId})
        }} >
          <View style={{paddingVertical: 2, paddingHorizontal: 20, backgroundColor: '#F6841F', borderRadius: 5}}>
            <Text style={{color: "#fff", fontSize: 13}}>Buy Again</Text>
          </View>
        </TouchableOpacity>}
      </View>

      <View style={{ height: 2, backgroundColor: '#F7F7FA'}} />

    {messageModalShown && 
      <MessageModal 
        type="Success"
        isVisible={messageModalShown}
        setIsVisible={(val) => setMessageModalShown(val)}
        message="Thank you for your response!"
      />}
    </>
  )
}
const Toggle = ({count, state, onPress}) => {
  return (
    <>
      <TouchableOpacity onPress={onPress} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 15}}>
        <Text style={{color: "#9E9E9E", fontSize: 13}}>{state ? `Hide` : `View (${count}) more items`}</Text>
        <CustomIcon.MCIcon name={state ? "chevron-up" : "chevron-down"} size={16} color="#9E9E9E" />
      </TouchableOpacity>
      <View style={{ height: 2, backgroundColor: '#F7F7FA'}} />
    </>
  )
}

const testdata = [{

  shipping: {

    shop: {shopname: "Face Mask PH"}
    },
  orderData: [{
    itemname: "Improved Copper Mask 2.0 White or Bronze",
    originalPrice: 380,
    totalAmount: 190,
    variation: "Black",
    quantity: 1,
  }, {
    itemname: "Improved Copper Mask 2.0 White or Bronze",
    originalPrice: 380,
    totalAmount: 190,
    variation: "White",
    quantity: 1,
  }],
  datePlaced: "6-14-21",
  recieveDate: "Jun 15",
  orderNumber: "000X001",
  total: 460
}, {
  shipping: {
  shop: {shopname: "The Apparel"}
  },
  orderData: [{
    itemname: "Graphic Tees",
    originalPrice: 380,
    totalAmount: 190,
    variation: "White, L",
    quantity: 1,
  }],
  datePlaced: "6-27-21",
  recieveDate: "Jun 15",
  orderNumber: "000X002",
  total: 270
}]

export const Completed = ({id, email}) => {

  const [toggleDrop, setToggleDrop] = useState(false)
  const [data, setData] = useState([])
  const [userId, setUserId] = useState(id)
  const [semail, setEmail] = useState(email)

  const [getOrders, {loading, error}] = useLazyQuery(GET_COMPLETED_ORDERS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        userId: userId || id,
        email: semail || email
      }
    },
    onCompleted: (response) => {
      if(response.getCompletedOrders){
        setData(response.getCompletedOrders)
      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const renderItem = ({item}) => {

    if(item.orderData.length > 1){

      return (
        <>
          <Store data={item?.shipping?.shop} />
          {!toggleDrop && <Item data={item.orderData[0]} fulldata={item} />}
          {toggleDrop && item.orderData.map((raw, i) => <Item key={i} data={raw} fulldata={item} />)}
          <Toggle 
            count={item.orderData.length - 1} 
            state={toggleDrop} 
            onPress={() => setToggleDrop(!toggleDrop)} 
          />
          <Summary data={item} />
        </>
      )

    }else{

      return (
        <>
          <Store data={item?.shipping?.shop} />
          {item.orderData.map((raw, i) => <Item key={i} data={raw} fulldata={item} />)}
          <Summary data={item} />
        </>
      )

    }
    
    
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
