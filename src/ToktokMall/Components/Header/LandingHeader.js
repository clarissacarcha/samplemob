import React from 'react';
import {View, Text, ImageBackground, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';
import FIcon5 from 'react-native-vector-icons/FontAwesome';
import AIcon from 'react-native-vector-icons/MaterialIcons';
import { COLOR, FONT } from '../../../res/variables'; 

export const LandingHeader = (props) => {

  const navigation = useNavigation();

  const onPress = throttle(
    () => {
      navigation.navigate("ToktokMallSearch");
    },
    1000,
    {trailing: false},
  );

    return (
        <>
            <ImageBackground 
        source={require("../../../assets/toktokmall-assets/images/banner.png")}
        imageStyle={{ resizeMode: "stretch", width: '100%'}}
        style={{width: "100%", height: 120}}
      >
        <View style={{flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
          <View style={{flex: 0, alignItems: 'center', paddingHorizontal: 15, paddingTop: 8}}>
            <FIcon5 name="chevron-left" color={COLOR.ORANGE} size={15}/>
          </View>
          <View style={{flex: 8, alignItems: 'center', paddingHorizontal: 15, paddingTop: 8}}>
            <Image source={require("../../../assets/toktok/images/ToktokHeader.png")} style={{width: '80%', height: 35, resizeMode: 'cover'}} />
          </View>
          <View style={{flex: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15, paddingTop: 8}}>
            <View style={{flexDirection: 'row', paddingRight: 8}}>
              <FIcon5 name="bell" color={COLOR.ORANGE} size={22}/>
              <View style={{ position: 'absolute', right: 0, top: 3, backgroundColor: COLOR.YELLOW, borderRadius: 9, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 11}}>{2}</Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity activeOpacity={1} onPress={onPress} style={{flex: 1, backgroundColor: '#fff', width: '90%', marginLeft: '5%', position: 'absolute', bottom: -15, padding: 4, elevation: 8, flexDirection: 'row', borderRadius: 6}}>
          <View style={{flex: 0, paddingHorizontal: 8, paddingVertical: 4}}>
            <AIcon name="search" color={COLOR.ORANGE} size={22}/>
          </View>
          <View style={{flex: 1, padding: 4}}>
            <Text style={{color: "darkgray"}}>Search</Text>
          </View>
        </TouchableOpacity>
      </ImageBackground>
      <View style={{height: 25}}></View>
        </>
    )
}