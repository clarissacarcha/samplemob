import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity} from 'react-native';
import { COLOR, FONT } from '../../../../../../res/variables';
import {LandingHeader, AdsCarousel} from '../../../../../Components';
import { ScrollView } from 'react-native-gesture-handler';
import CustomIcon from '../../../../../Components/Icons';

const testdata = [{
  image: require("../../../../../../assets/toktokmall-assets/images/Watch.png"),
  // image: {uri: ""},
  label: "Accessories"
}, {
  image: require("../../../../../../assets/toktokmall-assets/images/Electronics.png"),
  // image: {uri: ""},
  label: "Electronics"
}, {
  image: require("../../../../../../assets/toktokmall-assets/images/Furniture.png"),
  // image: {uri: ""},
  label: "Furnitures"
}, {
  image: require("../../../../../../assets/toktokmall-assets/images/Men's-Fashion.png"),
  // image: {uri: ""},
  label: "Men's Fashion"
}, {
  image: require("../../../../../../assets/toktokmall-assets/images/Pet-Care.png"),
  // image: {uri: ""},
  label: "Pet Care"
}]

export const Categories = ({data}) => {
    return (
      <>
        <View style={styles.container}>
            <View style={styles.heading}>
              <View style={{flex: 8}}>
                <Text style={styles.h1}>Categories</Text>
              </View>
              <TouchableOpacity style={{flex: 2, alignItems: 'flex-end', justifyContent: 'center'}}>
                <Text style={styles.link}>See all </Text>
              </TouchableOpacity>
              <View style={{flex: 0, alignItems: 'flex-end', justifyContent: 'center'}}>
                <CustomIcon.EIcon name="chevron-right" color="#F6841F" size={16} />
              </View>
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <View style={{flexDirection: 'row'}}>              
                
                {testdata && testdata.map((item, i) => 
                <TouchableOpacity style={{flex: 1, paddingBottom: 12, paddingHorizontal: 4}}>
                  {item.image && <Image source={item.image} style={styles.image} /> }
                  <Text style={styles.label}>{item.label}</Text>
                </TouchableOpacity>)}
  
              </View>
            </ScrollView>
          </View>
          <View style={styles.separator} />
      </>
    )
  }

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 15, paddingVertical: 0},
  heading: {paddingVertical: 20, flexDirection: 'row'},
  h1: {fontSize: 14, fontFamily: FONT.BOLD},
  link: {fontSize: 12, color: "#F6841F"},
  image: {width: 50, height: 50, resizeMode: 'cover', alignSelf: 'center', borderRadius: 8},
  label: {fontSize: 11, alignSelf: 'center'},
  separator: {flex: 0.5, height: 8, backgroundColor: '#F7F7FA'}
})