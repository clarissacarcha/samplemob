import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Dimensions } from 'react-native';
// import { COLOR, FONT } from '../../../../../../res/variables';
// import {LandingHeader, AdsCarousel} from '../../../../../Components';
// import { ScrollView } from 'react-native-gesture-handler';
// import CustomIcon from '../../../../../Components/Icons';
// import {watch, electronics, mensfashion, furniture, petcare} from '../../../../../assets'
import AddressForm from './AddressForm'
import Shops from './Shops'
import Voucher from './Vouchers'
import Payment from './Payment'
import Totals from './Totals'
import Button from './Button'
const REAL_WIDTH = Dimensions.get('window').width;

const testData = [
  {id: 1, full_name: 'Cloud Panda', contact_number: '09050000000',
    address: '10F, Inoza Tower, 40th Street, Bonifacio Global City', default: 1
  },
  {id: 2, full_name: 'Rick Sanchez', contact_number: '09060000000',
    address: 'B20 L1, Mahogany Street, San Isidro, Makati City', default: 0
  }
]

import coppermask from '../../assets/coppermask.png'
import suit from '../../assets/suit.png'

const testData2 = [
  {id: 1, shops: 'Facemask PH', 
    items: [{id: 1, item_name: 'Improved Copper Mask 2.0 White or Bronze', price: 190, variation: 'bronze', quantity: 1, sale_off: 380, image: coppermask},
      {id: 2, item_name: 'Improved Copper Mask 2.0 White or Bronze', price: 190, variation: 'white', quantity: 1, sale_off: 380,  image: coppermask}
    ], delivery_fee: 80, date_range_from: 'Jul 20', date_range_to: 'Jul 25'
  },
  {id: 2, shops: 'The Apparel', 
    items: [{id: 1, item_name: 'Graphic Tees', price: 190, variation: 'white', quantity: 1, sale_off: 380, image: suit},
    ], delivery_fee: 80, date_range_from: 'Jul 20', date_range_to: 'Jul 25'
  },

]

const Checkout = ({data}) => {

  const [scrolling, setScrolling] = useState(false)
  const [totals, setTotals] = useState([])
  

  const HandleOnScroll = (r) => {
    let ypos = r.nativeEvent.contentOffset.y
    if(ypos > 30) setScrolling(true)
    else if (ypos <= 100) setScrolling(false)
  }
    
  return (
    <>
      <ScrollView>
        <View style ={{paddingBottom: 80}} >
          {/* <FlatList
              data={[1]}
              keyExtractor={(item, index) => item + index}
              showsVerticalScrollIndicator={false}
              onScroll={HandleOnScroll}
              renderItem={({ item }) => (
                <>
                {!scrolling && <AdsCarousel data={[1,2,3]} />}  
                <Address data={[]} />
                <Items data={[]} />
                <Vouchers data={[]} />
                <FlashSale data={[]} />
                <Suggestions key={1} data={[]} />
                <View style={{height: 10}}></View>
                </>
              )}        
            />   */}
             <AddressForm data={[]} />
             <Shops data = {testData2} />
             
             <Voucher />
             <Payment />
             <Totals data = {testData2}/>
            {/* <AddressForm data={[]} />
            <Items data={[]} />
            <Vouchers data={[]} />
            <FlashSale data={[]} />
            <Suggestions key={1} data={[]} />
            <View style={{height: 10}}></View> */}
        </View>
        
      </ScrollView>  
      <View style ={styles.footer}>
               <Button data = {testData2} />
             </View>
    </>
    )
}

const styles = StyleSheet.create({
  body: {flex: 1, backgroundColor: '#F7F7FA', },
  container: {padding: 15, backgroundColor: 'white', marginTop: 15,  flex: 1},
  addressContainer: {borderRadius: 5, backgroundColor: '#F8F8F8', padding: 10, marginTop: 10, marginBottom: 10},
  defaultText: {color: '#F6841F'},
  fullName: {},
  contact_number: {color: '#9E9E9E'},
  address: {marginTop: 10, fontWeight: 'bold'},
  button: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, height: 50,
    elevation: 5, shadowOffset: {width: 1, height: 1}, shadowColor: '#000',

    shadowOpacity: 0.4,
    shadowRadius: 3
  },
  footer: {
    position: 'absolute',
    // top: REAL_WIDTH * 0.9,
    // bottom: -10,
    bottom: 0,
    left: 0,
    right: 0,
    // height: REAL_HEIGHT * 0.096,
    height: 80,
    width: REAL_WIDTH,
    backgroundColor: 'white',
    justifyContent: 'center',
    // alignItems: 'center',
    zIndex: 1,
  },
})

export default Checkout