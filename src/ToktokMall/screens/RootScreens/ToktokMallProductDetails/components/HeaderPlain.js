import React, {useState, useRef} from 'react';
import {View, Text, Image, FlatList, SectionList, ImageBackground, Platform} from 'react-native';
import { Badge, Tooltip } from 'react-native-elements';
import { useNavigation } from '@react-navigation/core';
import { Header } from '../../../../Components';
import {Price} from '../../../../helpers';
import CustomIcon from '../../../../Components/Icons';
import {coppermask, clothfacemask, voucherbg} from '../../../../assets';
import { FONT } from '../../../../../res/variables';

import Animated, {interpolate, Extrapolate, useCode, set} from 'react-native-reanimated'

export const HeaderPlain = ({value, animatedValue }) => {

  const navigation = useNavigation()
  const HelpTooltipRef = useRef(null)

  const translateOpacity = animatedValue.interpolate({
    inputRange: [250, 270],
    outputRange: [0,  1],
    // extrapolateLeft: Extrapolate.CLAMP
    extrapolate: 'clamp'
  })

	return (
		<>
      <Animated.View style={[{flexDirection: 'row', paddingTop: Platform.OS === "ios" ? 10 : 40, paddingBottom: 12, paddingHorizontal: 6, position: 'absolute', backgroundColor: 'white'}
      , {opacity: translateOpacity, zIndex: translateOpacity}]}>
        <View style={{flex: 1.4, alignItems: 'flex-start', justifyContent: 'center'}}>
          <CustomIcon.MCIcon name="chevron-left" color="#F6841F" size={28}  onPress={navigation.goBack}/>
        </View>
        <View style={{flex: 8, justifyContent: 'center'}}>
          <Text numberOfLines={1} style={{fontSize: 18}}>Improved Copper Mask 2.0 Bla..</Text>
        </View>
        <View style={{flex: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
          <View style={{flex: 0.5}}></View>
					<View style={{flex: 1, justifyContent: 'center'}}>
            <CustomIcon.AIcon name="shoppingcart" color="#F6841F" size={24} />
            <Badge
              status="warning"
              value="99+"
              badgeStyle={{backgroundColor: "#FDBA1C"}}
              textStyle={{fontFamily: FONT.REGULAR, fontSize: 10}}
              containerStyle={{ position: 'absolute', top: -4, right: 0 }}
            />
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Tooltip
              ref={HelpTooltipRef}
              backgroundColor="white"
              withPointer={false}
              containerStyle={{backgroundColor: 'white', alignItems: 'flex-start'}} 
              popover={<Text onPress={() => {
                HelpTooltipRef.current.toggleTooltip()
                navigation.navigate("ToktokMallHelp")
              }}>Help</Text>}>
              <CustomIcon.FeIcon name="more-horizontal" color="#F6841F" size={24} />
            </Tooltip>
          </View>
        </View>
      </Animated.View>
      <Animated.View style={[{height: 3, backgroundColor: '#F7F7FA'}, {opacity: translateOpacity}]} />
		</>
	)
}