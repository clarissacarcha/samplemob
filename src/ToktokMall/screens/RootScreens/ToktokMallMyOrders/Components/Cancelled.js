import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, FlatList} from 'react-native';
import {HeaderTab} from '../../../../Components';


const Store = ({data}) => {
  return (
    <>
      <View style={{flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 20}}>
        <View style={{flex: 0}}>
          <Image source={require("../../../../assets/icons/store.png")} style={{width: 24, height: 24, resizeMode: 'stretch'}} />
        </View>
        <View style={{flex: 1, paddingHorizontal: 7.5, justifyContent: 'center'}}>
          <Text style={{fontSize: 14}}>{data.name}</Text>
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
          <Text style={{color: "#9E9E9E", fontSize: 12}}>Order #: {data.orderNumber}</Text>
          <Text style={{color: "#9E9E9E", fontSize: 12}}>Order Placed: {data.datePlaced} </Text>
        </View>
        <View styl={{flex: 1}}>
          <Text style={{fontSize: 14}}>Order Total: <Text style={{color: "#F6841F", fontSize: 14}}>&#8369;{parseFloat(data.total).toFixed(2)}</Text></Text>
        </View>
      </View>
      <View style={{ height: 8, backgroundColor: '#F7F7FA'}} />
    </>
  )
}

const Item = ({data}) => {
  return (
    <>
      <View style={{flexDirection: 'row', paddingTop: 10, paddingBottom: 0, paddingHorizontal: 15}}>
        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, borderRadius: 5}}>
          <Image source={require("../../../../assets/images/coppermask.png")} style={{width: 55, height: 80, resizeMode: 'stretch', borderRadius: 5}} />
        </View>
        <View style={{flex: 8}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View>
              <Text style={{fontSize: 13, fontWeight: '100'}}>{data.label}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0}}>
                <Text style={{fontSize: 13, color: "#F6841F"}}>&#8369;{parseFloat(data.price).toFixed(2)}</Text>
              </View>
              <View style={{flex: 0, paddingHorizontal: 10}}>
                <Text style={{color: "#9E9E9E", textDecorationLine: 'line-through', fontSize: 11}}>&#8369;{parseFloat(data.originalPrice).toFixed(2)}</Text>
              </View>
           </View>
            <View style={{flexDirection: 'row', paddingVertical: 5}}>
              <View style={{flex: 2}}>
                <Text style={{color: "#9E9E9E", fontSize: 13}}>Variation: {data.variation}</Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={{color: "#9E9E9E", fontSize: 13}}>Qty: {data.qty}</Text>
              </View>
              <View style={{flex: 0.2}}></View>
            </View>
          </View>          
        </View>        
      </View>
      <View style={{flexDirection: 'row-reverse', paddingHorizontal: 15, paddingBottom: 15}}>
        <View style={{paddingVertical: 2, paddingHorizontal: 10, backgroundColor: '#F6841F', borderRadius: 5}}>
          <Text style={{color: "#fff", fontSize: 13}}>Buy Again</Text>
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
  recieveDate: "Jun 15",
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
  recieveDate: "Jun 15",
  orderNumber: "000X002",
  total: 270
}]


export const Cancelled = ({data, route}) => {

  const renderItem = ({item}) => {
    return (
      <>
        <Store data={item.shop} />
        {item.items.map((raw, i) => <Item key={i} data={raw} />)}
      </>
    )
  }

  return (
    <>
        <FlatList 
            data={testdata}
            renderItem={renderItem}
        />
    </>
  );
};
