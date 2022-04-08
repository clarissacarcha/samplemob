import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, FlatList, ScrollView} from 'react-native';
import { useLazyQuery } from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import {HeaderBack, HeaderTitle, HeaderRight, Loading} from '../../../Components';
import {Renderer} from './Components';
import { ApiCall } from '../../../helpers';
import {connect, useSelector} from "react-redux"
import {EventRegister} from 'react-native-event-listeners'
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_ORDER_DETAILS } from '../../../../graphql/toktokmall/model';
import { getRefComAccountType } from '../../../helpers';

import {
  RenderOrderInfo,
  RenderStore,
  RenderSummary,
  RenderDeliveryLog,
  RenderBuyAgain
} from './Components'

const Component = ({navigation, route, notificationCountSession, notifications}) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack onBack={() => {
      EventRegister.emit('refreshToktokmallNotifications')
      if(notifications > 0){
        notificationCountSession("remove", 1)
      }else{
        notificationCountSession("set", 0)
      }
      // route.params.onBack()
      navigation.pop()
    }} />,
    headerTitle: () => <HeaderTitle label={['Order Details', '']} />,
    headerRight: () => <HeaderRight hidden={true} />
  });

  const [data, setData] = useState([])
  const session = useSelector(state => state.session)
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

  const readNotification = async (payload) => {
    const req = await ApiCall(`read_notification`, payload, true)
    if(req.responseData && req.responseData.success){
      console.log("read notification success")
    }
  }

  useEffect(() => {
    // console.log(route.params)
    AsyncStorage.getItem("ToktokMallUser").then((raw) => {
      let data = JSON.parse(raw)
      if(data.userId){
        console.log(route.params.id)
        if(route.params.id){
          readNotification({id: route.params.id, userid: data.userId})
        }
      }
    })
  }, [])

  useEffect(() => {    
    getOrderDetails({variables: {
      input: {
        orderId: route.params.orderId,
        refCom: getRefComAccountType({session})
      }
    }})
  }, [])

  if(loading) {
    return <Loading state={loading} />
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <RenderOrderInfo data={data} />
        <RenderStore data={data} />
        <RenderSummary data={data} />
        <RenderDeliveryLog data={data} />
        {/* <RenderBuyAgain data={data}/> */}
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state) => ({
  notifications: state.toktokMall.notifications
})

const mapDispatchToProps = (dispatch) => ({
  notificationCountSession: (action, payload) => dispatch({type: 'TOKTOK_MALL_NOTIFICATION_COUNT', action,  payload}),
});

export const ToktokMallOrderDetails = connect(mapStateToProps, mapDispatchToProps)(Component);