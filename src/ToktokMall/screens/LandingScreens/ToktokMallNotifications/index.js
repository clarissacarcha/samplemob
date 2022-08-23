import React, { useState, useEffect, useRef, useCallback} from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList, BackHandler} from 'react-native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import RNFS from 'react-native-fs'
import { HeaderBack, HeaderTitle, HeaderRight, Dropdown, Header, Loading } from '../../../Components'
import CustomIcon from '../../../Components/Icons'
import { COLOR, FONT, FONT_SIZE } from '../../../../res/variables';

import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_ORDER_HISTORY, GET_ORDERS_AND_HISTORY, GET_ORDERS_NOTIFICATION } from '../../../../graphql/toktokmall/model';

import {Item, SubItem} from './Components'
import {emptynotification} from '../../../assets'

import { RefreshControl } from 'react-native'
import {connect} from "react-redux"

import AsyncStorage from '@react-native-community/async-storage'
import uuid from 'react-native-uuid'

import {EventRegister} from 'react-native-event-listeners'
import throttle from 'lodash.throttle'
import { useFocusEffect } from '@react-navigation/core'

// const testdata = [{
//     id: "00X003",
//     title: "Parcel is on it's way",
//     description: "Order &id is now on its way to deliver your item.",
//     date: "06-22-2021",
//     history: [],
//     imageSource: require("../../../assets/images/coppermask.png")
// }, {
//     id: "00X002",
//     title: "Parcel delivered",
//     description: "Order &id has been delivered. Thank you for shopping with us! Kindly leave us a rating or feedback.",
//     date: "06-22-2021",
//     history: [],
//     imageSource: require("../../../assets/images/coppermask.png")
// }, {
//     id: "00X001",
//     title: "Parcel delivered",
//     description: "Order &id has been delivered. Thank you for shopping with us! Kindly leave us a rating or feedback.",
//     date: "06-22-2021",
//     history: [{
//         title: "Confirm Receipt",
//         description: "Items for order &id has been delivered. Thank you for shopping with us! We’d like to hear your feedback. Kindly go to My Orders to leave a rating.",
//         date: "06-22-2021"
//     }, {
//         title: "Parcel is on its way",
//         description: "Order &id is now on its way to deliver your item. If you are not able to receive the item, kindly let the receiver provide an ID to our rider.",
//         date: "06-22-2021"
//     }, {
//         title: "Parcel is ready to be delivered",
//         description: "Order 000X001 is now being prepared to deliver your item.",
//         date: "06-22-2021"
//     }],
//     imageSource: require("../../../assets/images/coppermask.png")
// }]

const Component =  ({
  navigation,
  notifications,
  notificationCountSession,
}) => {

  // navigation.setOptions({
  // 	headerLeft: () => <HeaderBack hidden={true} />,
  //   headerTitle: () => <HeaderTitle label={['Notifications', '']} />,
  //   headerRight: () => <HeaderRight hidden={true} />
  // });

  var flatlistRef = useRef()
  const [scrollendreached, setscrollendreached] = useState(false)
	const [orderHistory, setOrderHistory] = useState([])
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(10)

  const [getOrderNotifications, {loading, error}] = useLazyQuery(GET_ORDERS_NOTIFICATION, {
		client: TOKTOK_MALL_GRAPHQL_CLIENT,
		fetchPolicy: 'network-only',
		onCompleted: (response) => {
			if(response.getOrdersNotification){				
        setOrderHistory(response.getOrdersNotification)        
			}
    },
    onError: (err) => {
      console.log(err)
    }
	})

	const [getOrderHistory, {loadingx, errorx}] = useLazyQuery(GET_ORDERS_AND_HISTORY, {
		client: TOKTOK_MALL_GRAPHQL_CLIENT,
		fetchPolicy: 'network-only',
		onCompleted: (response) => {
			if(response.getOrdersAndHistory){				
        let temp = orderHistory
        let latest = temp.concat(response.getOrdersAndHistory)
        setOrderHistory(latest)

        //count notifications
        let count = 0
        latest.map((item) => item.read == 0 ? count++ : count = count)
        notificationCountSession('set', count)
			}
    },
    onError: (err) => {
      console.log(err)
    }
	})

  const [loadMoreOrderHistory, {loading2, error2}] = useLazyQuery(GET_ORDERS_AND_HISTORY, {
		client: TOKTOK_MALL_GRAPHQL_CLIENT,
		fetchPolicy: 'network-only',
		onCompleted: (response) => {
			if(response.getOrdersAndHistory){				
        let temp = orderHistory
        let latest = temp.concat(response.getOrdersAndHistory)
        setOrderHistory(latest)

        //count notifications
        let count = 0
        latest.map((item) => item.read == 0 ? count++ : count = count)
        notificationCountSession('set', count)
			}
    },
    onError: (err) => {
      console.log(err)
    }
	})

  const RenderItem = ({item, index}) => {
    const [dropshown, setDropShown] = useState(false)

    return (
      <>
        <Item 
          active={dropshown}
          data={item} 
          onSelect={() => {
            setOrderHistory([])
            init()
          }} 
        />
        {/* {dropshown && item.history.map((raw, i) => 
          <SubItem 
            data={raw} 
            index={i} 
            root={item} 
            total={item.history.length} 
            onSelect={() => {
              // createNotificationsSession("read", raw.uuid)
            }}
          />)} */}
      </>
    )
  }

  const init = () => {
    AsyncStorage.getItem("ToktokMallUser").then((raw) => {
      const data = JSON.parse(raw)
      if(data.userId){
        setOrderHistory([])
        setOffset(0)
        setLimit(10)
        console.log(data.userId)
        getOrderNotifications({variables: {
          input: {
            userId: data.userId,
            // offset: orderHistory.length,
            // limit: 10
          }
        }})
      }
    })
  }

  useEffect(() => {
    //count notifications
    let count = 0
    if(orderHistory.length > 0){
      for(var x=0;x<orderHistory.length;x++){
        let order = orderHistory[x];
        if(order.read == 0) count++
        else count = count
      }
      console.log(count)
      if(count > 0){
        notificationCountSession('set', count)
      }else{
        notificationCountSession('set', 0)
      }      
    }
  }, [orderHistory, offset])

	useEffect(() => {
    init()
    return () => {
      setOrderHistory([])
      EventRegister.addEventListener('refreshToktokmallNotifications', init)	    
    }
	}, [])

  useFocusEffect(
    useCallback(() => {
      init()
    }, [])
  )

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [])
  )

  const loadmore = throttle(
    () => {
      if(scrollendreached){
        console.log("end", scrollendreached)
        loadMoreOrderHistory({
          variables: {
            input: {
              // userId: 9999
              userId: data.userId,
              offset: orderHistory.length,
              limit: 10
            }
          }
        })
      }else{
        console.log("end", scrollendreached)
      }
    },
    2000,
    {trailing: false},
  )

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingBottom = 1;
    // console.log(layoutMeasurement.height + contentOffset.y, contentSize.height - paddingBottom)
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingBottom;
  }

	if(loading){
		return (
			<>
				<View style={styles.container}>
	        <Header label="Notifications" />
					<View style={styles.margin1} />
					<Loading state={loading} />
				</View>
			</>
		)
	}

  if(!loading && orderHistory && orderHistory.length == 0 && !scrollendreached){
    return (
      <>
        <View style={styles.container}>
	        <Header label="Notifications" />
					<View style={styles.margin1} />
					<View style={styles.emptyContainer}>
            <Image source={emptynotification} style={styles.emptyImage} />
            <View style={styles.margin2} />
            <View>
    				  <Text style={styles.emptyText}>No notifications</Text>
  		    	</View>
          </View>
          <View style={styles.margin3} />
				</View> 
      </>
    )
  }

  return (
    <>
      <View style={styles.container}>
        <Header label="Notifications" />
        <View style={styles.subContainer}>                    
          <View style={styles.margin1} />               
            <FlatList
              ref={ref => flatlistRef = ref}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false} 
              data={orderHistory.slice(0, offset + limit)}
              scrollEventThrottle={16}
              renderItem={({item}) => <RenderItem item={item} />}
              refreshControl={
                <RefreshControl 
                  refreshing={loading}
                  onRefresh={() => {
                    init()
                  }}
                />
              }
              onEndReachedThreshold={0.1}
              onEndReached={() => {
                let newoffset = offset + limit
                if(newoffset == orderHistory.length || offset == orderHistory.length) return
                else if(newoffset > orderHistory.length){
                  setOffset(orderHistory.length - offset)
                }else{
                  setOffset(newoffset)
                }
              }}
            />
          </View>
      </View>
    </>
  )
}

const mapStateToProps = (state) => ({
  notifications: state.toktokMall.notifications
})

const mapDispatchToProps = (dispatch) => ({
  notificationCountSession: (action, payload) => dispatch({type: 'TOKTOK_MALL_NOTIFICATION_COUNT', action,  payload}),
});

export const ToktokMallNotifications = connect(mapStateToProps, mapDispatchToProps)(Component);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE
  },
  subContainer: {
    flex: 1
  },
  margin1: {
     height: 8, 
     backgroundColor: '#F7F7FA'
    },
  emptyContainer: {
    flex: 1, 
    backgroundColor: 'white', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  emptyImage: {
    width: '80%', 
    height: Dimensions.get("screen").height / 4, 
    resizeMode: 'contain'
  },
  margin2: {
    height: 8
  },
  emptyText: {
    fontSize: 16, 
    color: "#9E9E9E"
  },
  margin3: {
    flex: 0.1
  }
})
