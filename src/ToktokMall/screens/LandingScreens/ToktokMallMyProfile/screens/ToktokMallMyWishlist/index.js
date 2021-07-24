import React, {useState, useEffect} from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,FlatList,Image, TouchableOpacity} from 'react-native'
import { HeaderBack, HeaderTitle, HeaderRight, Card } from '../../../../../Components';
import CustomIcon from '../../../../../Components/Icons';
import { AlertOverlay} from '../../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../../res/variables';
import {coppermask} from '../../../../../assets';
import SwipeableView from 'react-native-swipeable-view';

import { MessageModal } from '../../../../../Components';
import {Item, Store, RenderFooter} from './Components'

const testdata = [{
  shop: {name: "Face Mask PH"},
  items: [{
    label: "Improved Copper Mask 2.0 White or Bronze",
    originalPrice: 380,
    price: 190,
    variation: "Black",
    qty: 1,
    stock: 4,
    image: ""
  }, {
    label: "Improved Copper Mask 2.0 White or Bronze",
    originalPrice: 380,
    price: 190,
    variation: "White",
    qty: 1,
    stock: 4,
    image: ""
  }]
}, {
  shop: {name: "The Apparel"},
  items: [{
    label: "Graphic Tees",
    originalPrice: 380,
    price: 190,
    variation: "White, L",
    qty: 1,
    image: ""
  }]
}]

export const ToktokMallMyWishlist = ({navigation})=> {

  const [willDelete, setWillDelete] = useState(false)
  const [messageModalShown, setMessageModalShown] = useState(false)

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Favorites', '']} />,
    headerRight: () => <HeaderRight hidden={!willDelete} label={willDelete ? "Done" : ""} onPress={() => {
      setWillDelete(false)
    }} />
  });

  const DeleteButton = ({onPress}) => {
    return (
      <>
        <TouchableOpacity onPress={onPress} activeOpacity={1} style={{flex: 1, backgroundColor: '#F6841F', alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 14, color: "#fff"}}>Delete</Text>
        </TouchableOpacity>
      </>
    )
  }

  const renderItem = ({item}) => {
    return (
      <>
        <Store data={item.shop} />
        {item.items.map((raw, i) => 
        <SwipeableView btnsArray={ [{
          text: "Delete",
          component: <DeleteButton onPress={() => {
            setMessageModalShown(true)
          }} />
        }] }>
          <Item 
            key={i} 
            data={raw}
            willDelete={willDelete} 
            onHold={() => setWillDelete(true)}
            onChecked={(item) => {
              console.log(item)
            }}
          />
        </SwipeableView>        
        )}
				<View style={{ height: 8, backgroundColor: '#F7F7FA'}} />
      </>
    )
  }

  return (
    <>
      <View style={{flex: 1, backgroundColor: 'white'}}>
				<FlatList 
					data={testdata}
					renderItem={renderItem}
				/>
        {willDelete && <RenderFooter onPressBuyNow={() => {
          setMessageModalShown(true)
        }} />}
        {messageModalShown && 
        <MessageModal 
          type="Success"
          isVisible={messageModalShown} 
          setIsVisible={(val) => setMessageModalShown(val)}
          message="Item has been removed from your favorites."
        />}
			</View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE
  }
})
