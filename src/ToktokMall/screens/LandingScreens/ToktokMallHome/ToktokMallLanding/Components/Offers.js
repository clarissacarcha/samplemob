import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity} from 'react-native';
import { COLOR, FONT } from '../../../../../../res/variables';
import {LandingHeader, AdsCarousel} from '../../../../../Components';
import { ScrollView } from 'react-native-gesture-handler';
import CustomIcon from '../../../../../Components/Icons';

const testdata = [{
  image: require("../../../../../../assets/toktokmall-assets/images/coppermask.png"),
  // image: {uri: ""},
  price: 380,
  discountedPrice: 190
}, {
  image: require("../../../../../../assets/toktokmall-assets/images/chair.png"),
  // image: {uri: ""},
  price: 280,
  discountedPrice: 140
}, {
  image: require("../../../../../../assets/toktokmall-assets/images/bottle.png"),
  // image: {uri: ""},
  price: 2280,
  discountedPrice: 1400
}, {
  image: require("../../../../../../assets/toktokmall-assets/images/chair.png"),
  // image: {uri: ""},
  price: 892,
  discountedPrice: 568
}]

export const Offers = ({data}) => {
    return (
      <>
        <View style={styles.container}>
            <View style={styles.heading}>
              <View style={{flex: 8}}>
                <Text style={{fontSize: 14, fontFamily: FONT.BOLD}}>Today's Offers</Text>
              </View>
              <TouchableOpacity style={{flex: 2, alignItems: 'flex-end', justifyContent: 'center'}}>
                <Text style={styles.link}>See all </Text>
              </TouchableOpacity>
              <View style={{flex: 0, alignItems: 'flex-end', justifyContent: 'center'}}>
                <CustomIcon.EIcon name="chevron-right" color="#F6841F" size={16} />
              </View>
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{borderRadius: 5, borderColor: '#F6841F', borderWidth: 1, paddingTop: 12, paddingHorizontal: 4}}>
              <View style={{flexDirection: 'row'}}>
                {testdata && testdata.map((item, i) => 
                  <View style={{flex: 1, paddingBottom: 12, paddingHorizontal: 0, alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={item.image || require("../../../../../../assets/images/BookingSuccess.png")} style={styles.image} />
                    <Text style={styles.label}>&#8369;{parseFloat(item.discountedPrice).toFixed(2)}</Text>
                    <Text style={styles.labelLine}>&#8369;{parseFloat(item.price).toFixed(2)}</Text>                
                  </View>)}            
              </View>
            </ScrollView>
          </View>
          {/* <View style={{flex: 0.5, height: 8, backgroundColor: '#F7F7FA'}} /> */}
      </>
    )
  }

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 15, paddingVertical: 0},
  heading: {paddingVertical: 20, flexDirection: 'row'},
  h1: {fontSize: 14, fontFamily: FONT.BOLD},
  link: {fontSize: 12, color: "#F6841F"},
  image: {width: 80, height: 80, resizeMode: 'cover', borderRadius: 5},
  label: {fontSize: 14, fontWeight: '600', color: "#F6841F"},
  labelLine: {fontSize: 11, textDecorationLine: 'line-through', color: "#9E9E9E"},
  separator: {flex: 0.5, height: 8, backgroundColor: '#F7F7FA'}
})