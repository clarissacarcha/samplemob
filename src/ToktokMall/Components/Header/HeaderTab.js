import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';
import CustomIcon from '../Icons';
import {COLOR, FONT} from '../../../res/variables';
import {Hairline} from '../../../components/widgets/Hairline';

const Tab = ({index, label, active, onPress}) => {

  const textStyle = Platform.OS === 'ios' ? {height: 14} : {height: 16};
  let bgcolor = active == index ? '#FFEBBC' : '#F8F8F8';
  let txtcolor = active == index ? '#F6841F' : '#929191';

  const onButtonPress = throttle(
    () => {
      if (onPress) {
        onPress();
      }
    },
    1000,
    {trailing: false},
  );

  return (
    <>
      <TouchableOpacity
        onPress={onButtonPress}
        style={{
          backgroundColor: bgcolor,
          paddingVertical: 15,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
        }}>
        <Text style={[{color: txtcolor, fontSize: 12}, textStyle]}>{label}</Text>
      </TouchableOpacity>
    </>
  );
};

export const HeaderTab = (props) => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(props.index || 0);

  const onBackPress = throttle(
    () => {
      if (props?.onBack) {
        props.onBack();
      } else {
        navigation.pop();
      }
    },
    1000,
    {trailing: false},
  );

  const onTabPress = (index) => {
    setActiveTab(index);
    if (props.onTabChange) {
      props.onTabChange(index);
    }
  };

  return (
    <>
      <View style={{height: 150}}>
        <View style={Platform.OS === "android" && {flex: 2}}></View>
        <View style={{flex: 5, flexDirection: 'row'}}>
          <TouchableOpacity onPress={onBackPress} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <CustomIcon.FA5Icon name="chevron-left" size={15} color={COLOR.ORANGE} />
          </TouchableOpacity>
          <View style={{flex: 6, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 16, fontFamily: FONT.REGULAR}}>My Orders</Text>
          </View>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} />
        </View>
        <View style={{flex: 2, flexDirection: 'row', paddingVertical: 15}}>
          <View style={{flex: 1}} />
          <View style={{flex: 8, justifyContent: 'center'}}>
            <Tab index={0} active={activeTab} label="Confirmed" onPress={() => onTabPress(0)} />
          </View>
          <View style={{flex: 1}}></View>
          <View style={{flex: 8, justifyContent: 'center'}}>
            <Tab index={1} active={activeTab} label="To Ship" onPress={() => onTabPress(1)} />
          </View>
          <View style={{flex: 1}}></View>
          <View style={{flex: 8, justifyContent: 'center'}}>
            <Tab index={2} active={activeTab} label="To Receive" onPress={() => onTabPress(2)} />
          </View>
          <View style={{flex: 1}}></View>
          <View style={{flex: 8, justifyContent: 'center'}}>
            <Tab index={3} active={activeTab} label="Completed" onPress={() => onTabPress(3)} />
          </View>
          {/* <View style={{flex: 1}}></View>
          <View style={{flex: 8, justifyContent: 'center'}}>
            <Tab index={3} active={activeTab} label="Cancelled" onPress={() => onTabPress(3)} />
          </View> */}
          <View style={{flex: 1}} />
        </View>
        <View style={{flex: 0.5}} />
        <Hairline />
        <View style={{flex: 0.5, height: 8, backgroundColor: '#F7F7FA'}} />
      </View>
    </>
  );
};
