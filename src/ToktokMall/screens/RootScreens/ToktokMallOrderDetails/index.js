import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useLazyQuery } from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import { HeaderBack, HeaderTitle, HeaderRight, Loading, LoadingOverlay, BuyAgainButton } from '../../../Components';
import { ApiCall } from '../../../helpers';
import { connect, useSelector } from "react-redux"
import { EventRegister } from 'react-native-event-listeners'
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_ACTIVIY_ORDER_DETAILS } from '../../../../graphql/toktokmall/model';
import { getRefComAccountType } from '../../../helpers';

import {
  RenderOrderInfo,
  RenderStore,
  RenderSummary,
  RenderDeliveryLog
} from './Components'

const Component = ({ navigation, route, notificationCountSession, notifications }) => {
  
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
  const [apiloader, setapiloader] = useState(false)
  const session = useSelector(state => state.session)

  const [getOrderDetails, {loading, error}] = useLazyQuery(GET_ACTIVIY_ORDER_DETAILS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      if(response.getActivityOrderDetails){
        setData(response.getActivityOrderDetails)
      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const readNotification = async (payload) => {
    const req = await ApiCall(`read_notification`, payload, true)
    if(req.responseData && req.responseData.success){
      // console.log("read notification success")
    }
  }

  useEffect(() => {
    AsyncStorage.getItem("ToktokMallUser").then((raw) => {
      let data = JSON.parse(raw)
      if(data.userId){
        if(route.params.id){
          readNotification({id: route.params.id, userid: data.userId})
        }
      }
    })
  }, [])

  const Fetch = async () => {
    if(route.params?.unpaidOrder == 1){
      //UNPAID ORDER
      getOrderDetails({variables: {
        input: {
          orderId: -1,
          referenceNum: route.params.referenceNum,
          refCom: getRefComAccountType({session})
        }
      }})

    }else{
      //PAID ORDER
      getOrderDetails({variables: {
        input: {
          orderId: route.params.id,
          referenceNum: "",
          refCom: getRefComAccountType({session})
        }
      }})
    }
  }

  useEffect(() => {  
    Fetch()
  },[])

  const onPressBuy = () => {
    setapiloader(!apiloader);
  }

  if(loading) {
    return <Loading state={loading} />
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={{
          marginBottom: route.params.cancelled || 
          data?.status?.status === 4 ? 70 : 10
        }}
        refreshControl={
          <RefreshControl 
            refreshing={loading}
            onRefresh={() => {
              Fetch()
            }}
          />
        }
      >
        <RenderOrderInfo data={data} />
        <RenderStore 
          data={data} 
          navigation={navigation}
        />
        <RenderSummary data={data} />
        <RenderDeliveryLog data={data} />
      </ScrollView>
      
      { data?.status?.status === 4 || data?.status?.status === 5 ?
        <View style={styles.footer}>
          <BuyAgainButton data={data} />
        </View> : <></>
      }
      
      {apiloader && <LoadingOverlay isVisible={apiloader} />}
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


const styles = StyleSheet.create({
  footer: {
      borderTopWidth: .50,
      borderTopColor: 'rgba(0, 0, 0, 0.25)',
      paddingHorizontal: 16,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      zIndex: 1,

  }
}) 