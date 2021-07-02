import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';


const ButtonTab = ({label, index, active, onPress}) => {

  let bgcolor = active  == index ? "#FFEBBC" : "#F8F8F8"
  let txtcolor = active == index ? "#F6841F" : "#929191"

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
      <TouchableOpacity onPress={onButtonPress} style={{ backgroundColor: bgcolor, borderRadius: 5, paddingHorizontal: 20, paddingVertical: 8}}>
        <Text style={{fontSize: 12, color: txtcolor}}>{label}</Text>
      </TouchableOpacity>
    </>
  )
}

export const Tab = (props) => {

  const [activeTab, setActiveTab] = useState(props.index || 0)

  const onTabPress = (index) => {
    setActiveTab(index)
    if(props.onTabChange){
        props.onTabChange(index)
    }
  }

	return (
		<>
			<View style={{flexDirection: 'row', paddingBottom: 15, paddingHorizontal: 15}}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ButtonTab 
            label="All Products"
            index={0}
            active={activeTab}
            onPress={() => onTabPress(0)}
          />
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ButtonTab 
            label="Categories"
            index={1}
            active={activeTab}
            onPress={() => onTabPress(1)}
          />
        </View>         
      </View>
      <View style={{paddingHorizontal: 15}}>
        <View style={{height: 2, backgroundColor: "#F7F7FA"}} />
      </View>
		</>
	)
}