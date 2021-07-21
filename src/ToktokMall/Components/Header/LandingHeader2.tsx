import React from 'react';
import {View, Text, ImageBackground, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// import {throttle} from 'lodash';
import FIcon5 from 'react-native-vector-icons/FontAwesome';
import AIcon from 'react-native-vector-icons/MaterialIcons';
import { COLOR, FONT } from '../../../res/variables'; 
import {banner, toktokmallH} from '../../assets';
import { LandingSubHeader } from '.';

import Animated, {interpolate, Extrapolate, useCode, set, greaterThan} from 'react-native-reanimated'
import {useValues, onScrollEvent, withTransition} from 'react-native-redash'

const MainHeader = ({onSearch}) => {
  return (
    <>
      <ImageBackground 
        source={banner}
        imageStyle={{ resizeMode: "stretch", width: '100%'}}
        style={{width: "100%", height: 120}}
      >
        <View style={{flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
          <View style={{flex: 0, alignItems: 'center', paddingHorizontal: 15, paddingTop: 8}}>
            <FIcon5 name="chevron-left" color={COLOR.ORANGE} size={15}/>
          </View>
          <View style={{flex: 2}}></View>
          <View style={{flex: 8, alignItems: 'center', paddingTop: 15}}>
            <Image source={toktokmallH} style={{width: '100%', height: 35, resizeMode: 'stretch'}} />
          </View>
          <View style={{flex: 2}}></View>
          <View style={{flex: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15, paddingTop: 8}}>
            <View style={{flexDirection: 'row', paddingRight: 8}}>
          {/* <FIcon5 name="bell" color={COLOR.ORANGE} size={22}/>
              <View style={{ position: 'absolute', right: 0, top: 3, backgroundColor: COLOR.YELLOW, borderRadius: 9, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 11}}>{2}</Text>
              </View> */}
            </View>
          </View>
        </View>
        <TouchableOpacity activeOpacity={1} onPress={onSearch} style={{flex: 1, backgroundColor: '#fff', width: '92%', marginLeft: '4%', position: 'absolute', bottom: -15, padding: 4, elevation: 8, flexDirection: 'row', borderRadius: 6, }}>
          <View style={{flex: 0, paddingHorizontal: 8,  paddingVertical: 4}}>
            <AIcon name="search" color={COLOR.ORANGE} size={22}/>
          </View>
          <View style={{flex: 0, justifyContent: 'center', paddingVertical: 4}}>
            <Text style={{color: "darkgray", fontSize: 13}}>Search</Text>
          </View>
        </TouchableOpacity>
      </ImageBackground>
      <View style={{height: 25}}></View>
    </>
  )
}

interface HeaderImageProps {
    y: Animated.Node<number>
}


export default  ({ y } : HeaderImageProps) => {

  const navigation = useNavigation();
  const top = interpolate( y ,{
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolateLeft: Extrapolate.CLAMP
  })
  const [toggle] = useValues<0 | 1>([0] , [])
  const transition = withTransition(toggle)
  const opacity = transition
  useCode(() => set(toggle, greaterThan(100, y )), [toggle, y]) 


//   const onPress = throttle(
    // () => {
    //   navigation.navigate("ToktokMallSearch");
    // },
    // 1000,
    // {trailing: false},
//   );

  return (
    <>
    <Animated.View style = {{ opacity }}>
      <ImageBackground 
        source={banner}
        imageStyle={{ resizeMode: "stretch", width: '100%'}}
        style={{width: "100%", height: 120, position: 'absolute', top: 0, left: 0}}
      >
        <View style={{flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
          <View style={{flex: 0, alignItems: 'center', paddingHorizontal: 15, paddingTop: 8}}>
            <FIcon5 name="chevron-left" color={COLOR.ORANGE} size={15}/>
          </View>
          <View style={{flex: 2}}></View>
          <View style={{flex: 8, alignItems: 'center', paddingTop: 15}}>
            <Image source={toktokmallH} style={{width: '100%', height: 35, resizeMode: 'stretch'}} />
          </View>
          <View style={{flex: 2}}></View>
          <View style={{flex: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15, paddingTop: 8}}>
            <View style={{flexDirection: 'row', paddingRight: 8}}>
          {/* <FIcon5 name="bell" color={COLOR.ORANGE} size={22}/>
              <View style={{ position: 'absolute', right: 0, top: 3, backgroundColor: COLOR.YELLOW, borderRadius: 9, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 11}}>{2}</Text>
              </View> */}
            </View>
          </View>
        </View>
        <TouchableOpacity activeOpacity={1} 
        // onPress={onSearch} 
        style={{flex: 1, backgroundColor: '#fff', width: '92%', marginLeft: '4%', position: 'absolute', bottom: -15, padding: 4, elevation: 8, flexDirection: 'row', borderRadius: 6, }}>
          <View style={{flex: 0, paddingHorizontal: 8,  paddingVertical: 4}}>
            <AIcon name="search" color={COLOR.ORANGE} size={22}/>
          </View>
          <View style={{flex: 0, justifyContent: 'center', paddingVertical: 4}}>
            <Text style={{color: "darkgray", fontSize: 13}}>Search</Text>
          </View>
        </TouchableOpacity>
      </ImageBackground>
      <View style={{height: 25}}></View>
      </Animated.View>
    </>
  )
}