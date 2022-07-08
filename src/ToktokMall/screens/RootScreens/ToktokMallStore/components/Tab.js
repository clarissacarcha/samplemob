import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
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
      <TouchableOpacity onPress={onButtonPress} style={styles.labelButton(bgcolor)}>
        <Text style={styles.labelText(txtcolor)}>{label}</Text>
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
			<View style={styles.container}>
        <View style={styles.buttonTabContainer}>
          <ButtonTab 
            label="All Products"
            index={0}
            active={activeTab}
            onPress={() => onTabPress(0)}
          />
        </View>
        {/* <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: 12}}>
          <ButtonTab 
            label="All Products"
            index={0}
            active={activeTab}
            onPress={() => onTabPress(0)}
          />
        </View>
        <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal:12}}>
          <ButtonTab 
            label="Categories"
            index={1}
            active={activeTab}
            onPress={() => onTabPress(1)}
          />
        </View>          */}
      </View>
      <View style={styles.marginContainer}>
        <View style={styles.margin1} />
      </View>
		</>
	)
}

const styles = StyleSheet.create({
  labelButton: (bgcolor) => {
    return {
      backgroundColor: bgcolor, 
      borderRadius: 5, 
      paddingHorizontal: 20, 
      paddingVertical: 8
    }
  },
  labelText: (txtcolor) => {
    return {
      fontSize: 12, 
      color: txtcolor
    }
  },
  container: {
    flexDirection: 'row', 
    paddingBottom: 15, 
    paddingHorizontal: 15
  },
  buttonTabContainer: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 12
  },
  marginContainer: {
    paddingHorizontal: 15
  },
  margin1: {
    height: 2, 
    backgroundColor: "#F7F7FA"
  }
})