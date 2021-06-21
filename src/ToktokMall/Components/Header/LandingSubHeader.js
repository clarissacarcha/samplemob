import React from 'react';
import {View, Text, ImageBackground, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';
import FIcon5 from 'react-native-vector-icons/FontAwesome';
import AIcon from 'react-native-vector-icons/MaterialIcons';
import { COLOR, FONT } from '../../../res/variables'; 

export const LandingSubHeader = (props) => {

  const navigation = useNavigation();

  const onPress = throttle(
    () => {
      // navigation.pop();
    },
    1000,
    {trailing: false},
  );

  const onBack = throttle(
    () => {
      navigation.pop();
    },
    1000,
    {trailing: false},
  );

  const onPressNotification = throttle(
    () => {
      navigation.navigate("ToktokMallNotifications");
    },
    1000,
    {trailing: false},
  );

  return (
    <>
      <ImageBackground 
        source={require("../../../assets/toktok/images/HeaderBackground.png")}
        imageStyle={{ resizeMode: "cover", width: '200%'}}
        style={{width: "100%", height: 100}}
      >
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 35}}>
          <TouchableOpacity onPress={onBack} style={{flex: 0, alignItems: 'center', paddingHorizontal: 15, paddingTop: 8}}>
            <FIcon5 name="chevron-left" color={COLOR.ORANGE} size={15}/>
          </TouchableOpacity>
          <View style={{flex: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 0, paddingTop: 8}}>
            <TouchableOpacity activeOpacity={1} onPress={onPress} style={{flex: 0, backgroundColor: '#fff', width: '100%', padding: 4, elevation: 0, flexDirection: 'row', borderRadius: 6}}>
              <View style={{flex: 0, paddingHorizontal: 8, paddingVertical: 4}}>
                <AIcon name="search" color={COLOR.ORANGE} size={22}/>
              </View>
              <View style={{flex: 1, padding: 4}}>
                <Text style={{color: "darkgray"}}>Search</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flex: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingTop: 8}}>
            <TouchableOpacity onPress={onPressNotification} style={{flexDirection: 'row', paddingRight: 8}}>
              <FIcon5 name="bell" color={COLOR.ORANGE} size={22}/>
              <View style={{ position: 'absolute', right: 0, top: 3, backgroundColor: COLOR.YELLOW, borderRadius: 9, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 11}}>{2}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>        
      </ImageBackground>
    </>
  )
}