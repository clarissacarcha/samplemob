import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, TextInput, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';
import FIcon5 from 'react-native-vector-icons/FontAwesome';
import AIcon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/dist/AntDesign'
import { SearchBar } from 'react-native-elements';
import {banner} from '../../assets';
import { COLOR, FONT, FONT_SIZE } from '../../../res/variables'; 

export const LandingSubHeader = (props) => {

  const navigation = useNavigation();
  const searchFieldRef = useRef(null)

  const onPress = throttle(
    () => {
      if(props.onPress){
        props.onPress()
      }
      // navigation.pop();
    },
    1000,
    {trailing: false},
  );

  const onBack = throttle(
    () => {
      if(props?.onBack){
        props.onBack();
      }else{
        navigation.pop();
      }
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

  const [searchValue, setSearchValue] = useState('')

  const handleOnSearch = (val) => {
    setSearchValue(val)
    if(props.onSearch) props.onSearch(val)
  }

  const handleOnSubmit = () => {
    if(props.onSubmit) props.onSubmit()
  }

  useEffect(() => {
    setSearchValue(props.initialValue)
  }, [props.initialValue])

  return (
    <>
      <ImageBackground 
        source={banner}
        imageStyle={{ resizeMode: "stretch", width: '100%'}}
        style={{width: "100%", height: 100}}
      >
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 35}}>
          <TouchableOpacity onPress={onBack} style={{flex: 0, alignItems: 'center', paddingHorizontal: 15, paddingTop: 8}}>
            <FIcon5 name="chevron-left" color={COLOR.ORANGE} size={15}/>
          </TouchableOpacity>
          <View style={{flex: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 0, paddingTop: 8}}>
            <TouchableOpacity activeOpacity={1} onPress={onPress} style={{flex: 0, backgroundColor: '#fff', width: '100%', elevation: 0, flexDirection: 'row', borderRadius: 6}}>
              <View style={{flex: 0, justifyContent: 'center', paddingLeft: 8}}>
                <AIcon name="search" color={COLOR.ORANGE} size={22}/>
              </View>
              <View style={{flex: 1}}>

                {props.static ? 
                
                <TouchableOpacity activeOpacity={1} onPress={props.onPress} style={{paddingVertical: 4, backgroundColor: 'transparent'}}>
                  <Text style={{paddingHorizontal: 4, paddingVertical: 8, fontFamily: FONT.REGULAR, color: "#818181"}}>{props.placeholder}</Text>
                </TouchableOpacity>
                
                :
                
                <TextInput 
                  ref={searchFieldRef}
                  placeholder={props.placeholder ? props.placeholder : "Search"}
                  value={searchValue}
                  autoFocus={props.focused ? props.focused : false}
                  onChangeText={(val) => handleOnSearch(val)}
                  style={{paddingVertical: 8, fontFamily: FONT.REGULAR}} 
                  blurOnSubmit={true}                  
                  onSubmitEditing={(event) => {
                    // setTimeout(() => {
                    //   handleOnSubmit()
                    // }, 700)
                    console.log("Submitted")
                    searchFieldRef.current.isFocused(false)
                    handleOnSubmit()               
                  }}
                />}
              </View>
              {
                searchValue?.length > 0 ?
                <TouchableOpacity style={{flex: 0, justifyContent: 'center', paddingRight: 8}} onPress = {() => {setSearchValue('')
                  props.onClear?.()
                }}>
                  <AntIcon name="close" color={COLOR.ORANGE} size={18}/>
                </TouchableOpacity>
                : <></>
              }
              
            </TouchableOpacity>
          </View>
          <View style={{flex: 0.5}} />
          {/* <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingTop: 8}}>
            <TouchableOpacity onPress={onPressNotification} style={{flexDirection: 'row', paddingRight: 8}}>
              <FIcon5 name="bell" color={COLOR.ORANGE} size={22}/>
              <View style={{ position: 'absolute', right: 0, top: 3, backgroundColor: COLOR.YELLOW, borderRadius: 9, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 11}}>{2}</Text>
              </View>
            </TouchableOpacity>
          </View> */}
        </View>        
      </ImageBackground>
    </>
  )
}
