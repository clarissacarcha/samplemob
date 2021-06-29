import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity} from 'react-native';
import { COLOR, FONT } from '../../../../../../res/variables';
import {LandingHeader, AdsCarousel} from '../../../../../Components';
import { ScrollView } from 'react-native-gesture-handler';
import CustomIcon from '../../../../../Components/Icons';

const testdata = [{
  image: require("../../../../../../assets/toktokmall-assets/images/coppermask.png"),
  price: 1290,
  discount: "50% Off",
  discountPrice: 890
}, {
  image: require("../../../../../../assets/toktokmall-assets/images/chair.png"),
  price: 2800,
  discount: "50% Off",
  discountPrice: 1400
}, {
  image: require("../../../../../../assets/toktokmall-assets/images/bottle.png"),
  price: 967,
  discount: "50% Off",
  discountPrice: 553
}]

const Item = ({data}) => {
    return (
        <>
            <View style={{flex: 2, paddingBottom: 4, marginHorizontal: 2, alignItems: 'center', backgroundColor: '#fff', borderRadius: 5}}>
                <View style={{height: 4}}></View>
                <Image source={data.image} style={{width: '100%', height: 120, resizeMode: 'stretch', alignSelf: 'center', borderRadius: 5}} />
                <View style={{height: 2}}></View>
                <Text style={{fontSize: 14, fontWeight: '600', color: "#F6841F", alignSelf: 'flex-start', paddingHorizontal: 5}}>&#8369;{parseFloat(890).toFixed(2)}</Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{flex: 1, fontSize: 10, textDecorationLine: 'line-through', alignSelf: 'flex-start', paddingHorizontal: 5, color: "#9E9E9E"}}>&#8369;{parseFloat(1290).toFixed(2)}</Text>
                  <Text style={{flex: 1, fontSize: 11, alignSelf: 'flex-start', paddingHorizontal: 5, color: "#FDBA1C"}}>50% Off</Text>
                </View>
            </View>
        </>
    )
}

export const FlashSale = () => {
    return (
        <>
        <ImageBackground 
          source={require("../../../../../../assets/toktokmall-assets/images/flash-sale-bg.png")}
          imageStyle={{resizeMode: 'cover'}}          
          style={{flex: 1, paddingHorizontal: 15, paddingVertical: 0}}>
          
          <View style={{paddingVertical: 0, flexDirection: 'row'}}>
            <View style={{flex: 4}}>
              <Image source={require("../../../../../../assets/toktokmall-assets/images/Flash-Sale.png")} style={{width: 90, height: 90, resizeMode: 'center', justifyContent: 'center', alignSelf: 'flex-end'}} />
            </View>
            <View style={{flex: 7, justifyContent: 'center', paddingHorizontal: 4}}>
              <Text style={{fontSize: 14, fontFamily: FONT.BOLD}}>&nbsp;UP TO 80% OFF</Text>
              <Text style={{color: "#747575", fontSize: 12}}>Offer ends 5.17.2021</Text>
            </View>
            <TouchableOpacity style={{flex: 3, alignItems: 'flex-end', justifyContent: 'center'}}>
              <Text style={{fontSize: 12, color: "#F6841F", fontWeight: '600'}}>Shop now </Text>
            </TouchableOpacity>
            <View style={{flex: 0, alignItems: 'flex-end', justifyContent: 'center'}}>
              <CustomIcon.EIcon name="chevron-right" color="#F6841F" size={16} />
            </View>
          </View>
          <View>
          {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{paddingHorizontal: 4}}> */}
            <View style={{flexDirection: 'row', paddingTop: 3}}>
              
              {testdata && testdata.map((item, i) => <Item key={i} data={item} />)}

            </View>
          {/* </ScrollView> */}
          </View>
          <View style={{height: 15}}></View>
        </ImageBackground>
        <View style={{flex: 0.5, height: 8, backgroundColor: '#F7F7FA'}} />
        </>
    )
}