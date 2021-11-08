import React, {useState, useRef} from 'react';
import {View, Text, Image, FlatList, SectionList, ImageBackground, Platform} from 'react-native';
import { Badge, Tooltip } from 'react-native-elements';
import { useNavigation } from '@react-navigation/core';
import { Header } from '../../../../Components';
import {Price} from '../../../../helpers';
import CustomIcon from '../../../../Components/Icons';
import {coppermask, clothfacemask, voucherbg} from '../../../../assets';
import { FONT } from '../../../../../res/variables';

const transparentBg = "rgba(129, 129, 129, 0.5)"
import Animated, {interpolate, Extrapolate, useCode, set} from 'react-native-reanimated'
import { TouchableOpacity } from 'react-native-gesture-handler';


export const HeaderTransparent = ({value, outOfStock = false, animatedValue, cartItems}) => {

  const translateOpacity = animatedValue.current.interpolate({
    // inputRange: [250, 270],
    inputRange: [0, 1],
    outputRange: [1,  0],
    // extrapolateLeft: Extrapolate.CLAMP
    extrapolate: 'clamp'
  })


  const navigation = useNavigation()
  const HelpTooltipRef = useRef(null)

	return (
		<>
      <Animated.View style={[{position: 'absolute', width: '100%', zIndex: 1, backgroundColor: 'transparent', paddingTop: Platform.OS === "ios" ? 10 : 40, paddingBottom: 12, paddingHorizontal: 6},
        {opacity: translateOpacity}]}>
        <View style={{width: '100%', flexDirection: 'row'}}>
          <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center', backgroundColor: transparentBg, height: 28, borderRadius: 35/2}}>
            <CustomIcon.MCIcon name="chevron-left" color="#fff" size={28} onPress={navigation.goBack} />
          </View>
          <View style={{flex: 8, justifyContent: 'center'}} />
          <View style={{flex: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
            <View style={{flex: 0.5}}></View>
            <TouchableOpacity 
              onPress={() => {
                navigation.navigate("ToktokMallMyCart", {})
              }}
              style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: transparentBg, height: 28, width: 28, borderRadius: 35/2, paddingRight:1}}
            >            
              <CustomIcon.AIcon name="shoppingcart" color="#fff" size={22} />      
            </TouchableOpacity>
            {/* <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: transparentBg, height: 28, borderRadius: 35/2}}>
              <Tooltip
                ref={HelpTooltipRef}
                backgroundColor="white"
                withPointer={false}
                overlayColor="transparent"
                containerStyle={{backgroundColor: 'white', alignItems: 'flex-start'}} 
                popover={<Text onPress={() => {
                  HelpTooltipRef.current.toggleTooltip()
                  navigation.navigate("ToktokMallHelp")
                }}>Help</Text>}>
                <CustomIcon.FeIcon name="more-horizontal" color="#fff" size={24} />
              </Tooltip>
            </View> */}
              {cartItems == 0 ?
                <Badge
                  status="warning"
                  badgeStyle={{backgroundColor: "#FDBA1C"}}
                  textStyle={{fontFamily: FONT.REGULAR, fontSize: 10}}
                  containerStyle={{ position: 'absolute', top: 0, right: 10 }}
                /> : 
                <Badge
                  status="warning"
                  value={cartItems >= 100 ? "99+" : cartItems}
                  badgeStyle={{backgroundColor: "#FDBA1C"}}
                  textStyle={{fontFamily: FONT.REGULAR, fontSize: 10}}
                  containerStyle={{ position: 'absolute', top: -5, right: 5 }}
                />
              } 
          </View>
        </View>
        
        {outOfStock && 
        <View style={{backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center'}}>
          <View style={{width: 150, height: 150, borderRadius: 150/2, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.25)'}}>
            <Text style={{fontFamily: FONT.BOLD, fontSize: 18, color: "#fff"}}>OUT OF STOCK</Text>
          </View>
        </View>}

      </Animated.View>
      <Animated.View style={[{height: 3, backgroundColor: '#F7F7FA'}, {opacity: translateOpacity}]} />
		</>
	)
}