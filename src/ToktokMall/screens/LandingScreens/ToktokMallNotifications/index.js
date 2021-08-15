import React, { useState, useEffect } from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList} from 'react-native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import RNFS from 'react-native-fs'
import { HeaderBack, HeaderTitle, HeaderRight, Dropdown, Header, Loading } from '../../../Components'
import CustomIcon from '../../../Components/Icons'
import { COLOR, FONT, FONT_SIZE } from '../../../../res/variables';

import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_ORDER_HISTORY } from '../../../../graphql/toktokmall/model';

import {Item, SubItem} from './Components'

const testdata = [{
    id: "00X003",
    title: "Parcel is on it's way",
    description: "Order &id is now on its way to deliver your item.",
    date: "06-22-2021",
    history: [],
    imageSource: require("../../../assets/images/coppermask.png")
}, {
    id: "00X002",
    title: "Parcel delivered",
    description: "Order &id has been delivered. Thank you for shopping with us! Kindly leave us a rating or feedback.",
    date: "06-22-2021",
    history: [],
    imageSource: require("../../../assets/images/coppermask.png")
}, {
    id: "00X001",
    title: "Parcel delivered",
    description: "Order &id has been delivered. Thank you for shopping with us! Kindly leave us a rating or feedback.",
    date: "06-22-2021",
    history: [{
        title: "Confirm Receipt",
        description: "Items for order &id has been delivered. Thank you for shopping with us! We’d like to hear your feedback. Kindly go to My Orders to leave a rating.",
        date: "06-22-2021"
    }, {
        title: "Parcel is on its way",
        description: "Order &id is now on its way to deliver your item. If you are not able to receive the item, kindly let the receiver provide an ID to our rider.",
        date: "06-22-2021"
    }, {
        title: "Parcel is ready to be delivered",
        description: "Order 000X001 is now being prepared to deliver your item.",
        date: "06-22-2021"
    }],
    imageSource: require("../../../assets/images/coppermask.png")
}]

export const ToktokMallNotifications = ({navigation})=> {

  navigation.setOptions({
  	headerLeft: () => <HeaderBack hidden={true} />,
    headerTitle: () => <HeaderTitle label={['Notifications', '']} />,
    headerRight: () => <HeaderRight hidden={true} />
  });

	const [notifications, setNotifications] = useState([])

	const [getOrderHistory, {loading, error}] = useLazyQuery(GET_ORDER_HISTORY, {
		client: TOKTOK_MALL_GRAPHQL_CLIENT,
		fetchPolicy: "network-only",
		variables: {
			input: {
				email: "wilking.rhodalinne@gmail.com"
			}
		},
		onCompleted: (response) => {
			if(response.getOrderHistory){
				setNotifications(response.getOrderHistory)
			}
    },
    onError: (err) => {
      console.log(err)
    }
	})

  const RenderItem = ({item}) => {
    const [dropshown, setDropShown] = useState(false)
    return (
      <>
        <Item 
          active={dropshown}
          data={item} 
          onSelect={() => setDropShown(!dropshown)} 
        />
        {dropshown && item.history.map((raw, i) => 
          <SubItem 
            data={raw} 
            index={i} 
            root={item} 
            total={item.history.length} 
          />)}
      </>
    )
  }

	useEffect(() => {
		getOrderHistory()
	}, [])

	if(loading){
		return (
			<>
				<View style={styles.container}>
	        <Header label="Notifications" />
					<View style={{ height: 8, backgroundColor: '#F7F7FA'}} />
					<Loading state={loading} />
				</View>
			</>
		)
	}

  return (
    <>
      <View style={styles.container}>
        <Header label="Notifications" />
        <View style={{flex: 1}}>                    
          <View style={{ height: 8, backgroundColor: '#F7F7FA'}} />               
            <FlatList
              showsVerticalScrollIndicator={false} 
              data={notifications}
              renderItem={({item}) => <RenderItem item={item} />}
            />
          </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE
  }
})
