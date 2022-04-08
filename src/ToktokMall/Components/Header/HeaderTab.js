import React, { useState, useRef, useEffect } from 'react';
import {
  View, 
  Text,
  TouchableOpacity, 
  Platform,
  StyleSheet
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';
import {COLOR, FONT} from '../../../res/variables';
import { ScrollView } from 'react-native-gesture-handler';
import CustomIcon from '../Icons';

const Tab = ({index, label, active, onPress}) => {

  const textStyle = Platform.OS === 'ios' ? {height: 14} : {height: 16};
  let bgcolor = active == index ? '#F6841F' : '#F8F8F8';
  let txtcolor = active == index ? '#FFFFFF' : '#F6841F';
  let fontWeight = active == index ? '600' : '400';

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
        style={styles.orderStatusButton(bgcolor)}>
        <Text style={styles.orderStatusButtonText(textStyle, txtcolor, fontWeight)}>{label}</Text>
      </TouchableOpacity>
    </>
  );
};

export const HeaderTab = (props) => {
  const navigation = useNavigation();
  const orderStatusScrollviewRef = useRef(null);
  const [activeTab, setActiveTab] = useState(props.index || 0);

  useEffect(() => {
    orderStatusScrollviewRef.current.scrollTo({ x: 80 * props.index})
  }, [])
  
  useEffect(() => {
    if(props.index || props.index === 0) { 
      orderStatusScrollviewRef.current.scrollTo({ x: 80 * props.index })
    }
  }, [props.index])

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
      <View style={styles.container}>
        <View style={styles.headerNavContainer}>
          <TouchableOpacity onPress={onBackPress} style={styles.headerNavBackButton}>
            <CustomIcon.FA5Icon name="chevron-left" size={15} color={COLOR.ORANGE} />
          </TouchableOpacity>
          <View style={styles.headerNavTitle}>
            <Text style={styles.headerNavTitleText}>Activities</Text>
          </View>
          <View style={styles.headerNavRightContainer} />
        </View>
        <View style={styles.orderStatusContainer}>
          <ScrollView ref={orderStatusScrollviewRef} horizontal showsHorizontalScrollIndicator={false}>
            <View style={{...styles.orderStatusButtonContainer, marginLeft: 16}}>
              <Tab index={0} active={activeTab} label="All" onPress={() => onTabPress(0)} />
            </View>
            <View style={styles.orderStatusButtonContainer}>
              <Tab index={1} active={activeTab} label="Confirmed" onPress={() => onTabPress(1)} />
            </View>
            <View style={styles.orderStatusButtonContainer}>
              <Tab index={2} active={activeTab} label="To Ship" onPress={() => onTabPress(2)} />
            </View>
            <View style={styles.orderStatusButtonContainer}>
              <Tab index={3} active={activeTab} label="To Receive" onPress={() => onTabPress(3)} />
            </View>
            <View style={styles.orderStatusButtonContainer}>
              <Tab index={4} active={activeTab} label="Delivered" onPress={() => onTabPress(4)} />
            </View>
            <View style={{...styles.orderStatusButtonContainer, marginRight: 16}}>
              <Tab index={5} active={activeTab} label="Cancelled" onPress={() => onTabPress(5)} />
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? 100 : 140,
  },
  headerNavContainer: {
    paddingTop: Platform.OS === 'ios' ? 0 : 30,
    flex: Platform.OS === 'ios' ? 1 : 3,
    flexDirection: 'row',
    backgroundColor: 'white',
    shadowColor: '#470000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: .2,
    zIndex: 10,
    elevation: 4,
  },
  headerNavBackButton: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  headerNavTitle: {
    flex: 6, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  headerNavTitleText: {
    fontSize: 16, 
    fontFamily: FONT.REGULAR
  },
  headerNavRightContainer: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  orderStatusButton: (bgcolor) => {
    return {
      backgroundColor: bgcolor,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      height: 20,
      borderWidth: 1,
      borderColor: "#F6841F",
    }
  },
  orderStatusButtonContainer: {
    justifyContent: 'center',
    width: 80,
    marginHorizontal: 5
  },
  orderStatusContainer: {
    height: 52,
    backgroundColor: 'white',
    shadowColor: '#470000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: .1, 
    zIndex: 5,
    elevation: 3,
  },
  orderStatusButtonText: (textStyle, txtcolor, fontWeight) => {
    return {
      ...textStyle,
      fontSize: 11,
      fontWeight: fontWeight,
      color: txtcolor
    }
  }
})