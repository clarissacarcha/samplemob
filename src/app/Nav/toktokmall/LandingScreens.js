import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import EIcon from 'react-native-vector-icons/Entypo';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import FoIcon from 'react-native-vector-icons/Fontisto';
import AIcon from 'react-native-vector-icons/AntDesign';

import {COLOR, FONT_SIZE, SIZE} from '../../../res/variables';

import { 
  
  //Categories  
  ToktokMallCategoriesList, 
  ToktokMallCategoriesSearch, 

  //Home
  ToktokMallLandingScreen, 
  ToktokMallStore, 

  //Messages
  ToktokMallMessageHome,
  ToktokMallMessageConvo,

  //My Cart
  ToktokMallMyCart,

  //My Profile
  ToktokMallHelp,
  ToktokMallMyFollowing,
  ToktokMallMyVouchers,
  ToktokMallMyOrders,
  ToktokMallMyProfileHome

 } from '../../../ToktokMall/screens';

const ToktokMallLandingBottomTab = createBottomTabNavigator();

const ToktokMallCategoriesStack = createStackNavigator();
const ToktokMallHomeStack = createStackNavigator();
const ToktokMallMessagesStack = createStackNavigator();
const ToktokMallMyProfileStack = createStackNavigator();

const ToktokMallCategoriesStackScreen = () => (
  <ToktokMallCategoriesStack.Navigator initialRouteName="ToktokMallCategoriesList">
    <ToktokMallCategoriesStack.Screen
      name="ToktokMallCategoriesList"
      component={ToktokMallCategoriesList}
      options={{
        headerShown: false,
      }}
    />
    <ToktokMallCategoriesStack.Screen
      name="ToktokMallCategoriesSearch"
      component={ToktokMallCategoriesSearch}
      options={{
        headerShown: false,
      }}
    />
  </ToktokMallCategoriesStack.Navigator>
);

const ToktokMallHomeStackScreens = () => (
  <ToktokMallHomeStack.Navigator initialRouteName="ToktokMallLanding">
    <ToktokMallHomeStack.Screen
      name="ToktokMallLanding"
      component={ToktokMallLandingScreen}
      options={{
        headerShown: false,
      }}
    />
    <ToktokMallHomeStack.Screen
      name="ToktokMallStore"
      component={ToktokMallStore}
      options={{
        headerShown: false,
      }}
    />
  </ToktokMallHomeStack.Navigator>
);

const ToktokMallMessagesStackScreens = () => (
  <ToktokMallMessagesStack.Navigator initialRouteName="ToktokMallMessageHome">
    <ToktokMallMessagesStack.Screen
      name="ToktokMallMessageHome"
      component={ToktokMallMessageHome}
    />
    <ToktokMallMessagesStack.Screen
      name="ToktokMallMessageConvo"
      component={ToktokMallMessageConvo}
    />
  </ToktokMallMessagesStack.Navigator>
);

const ToktokMallMyProfileStackScreens = () => (
  <ToktokMallMyProfileStack.Navigator initialRouteName="ToktokMallMyProfileHome" headerMode="none">
    <ToktokMallMyProfileStack.Screen
      name="ToktokMallMyProfileHome"
      component={ToktokMallMyProfileHome}
      options={{
        headerShown: false,
      }}
    />
    <ToktokMallMyProfileStack.Screen
      name="ToktokMallMyOrders"
      component={ToktokMallMyOrders}
      options={{
        headerShown: false,
      }}
    />
    <ToktokMallMyProfileStack.Screen
      name="ToktokMallMyFollowing"
      component={ToktokMallMyFollowing}
      options={{
        headerShown: false,
      }}
    />
    <ToktokMallMyProfileStack.Screen
      name="ToktokMallMyVouchers"
      component={ToktokMallMyVouchers}
      options={{
        headerShown: false,
      }}
    />
    <ToktokMallMyProfileStack.Screen
      name="ToktokMallHelp"
      component={ToktokMallHelp}
      options={{
        headerShown: false,
      }}
    />    
  </ToktokMallMyProfileStack.Navigator>
);

const ToktokMallLanding = () => (
  <ToktokMallLandingBottomTab.Navigator 
    initialRouteName="toktokmall" 
    screenOptions={{headerShown: false, headerMode: "none"}}
    tabBarOptions={{
      activeTintColor: COLOR.YELLOW,
      inactiveTintColor: COLOR.DARK,
      allowFontScaling: false,
      indicatorStyle: {backgroundColor: COLOR.YELLOW},
      labelStyle: {
        fontFamily: 'Rubik-Regular',
        textTransform: 'none',
        fontSize: 9,
      },
      tabStyle: {
        padding: 4
      }
    }}
  >
    <ToktokMallLandingBottomTab.Screen 
      name="My Cart" 
      component={ToktokMallMyCart} 
      options={{
        tabBarBadge: 3,
        tabBarIcon: ({color}) => <AIcon name="shoppingcart" color={COLOR.YELLOW} size={24} />       
      }}
    />
    <ToktokMallLandingBottomTab.Screen 
      name="Categories" 
      component={ToktokMallCategoriesStackScreen} 
      options={{
        tabBarIcon: ({color}) => <AIcon name="profile" color={COLOR.YELLOW} size={24} />
      }}
    />
    <ToktokMallLandingBottomTab.Screen 
      name="toktokmall" 
      component={ToktokMallHomeStackScreens} 
      options={{
        tabBarIcon: ({color}) => <FoIcon name="shopping-bag-1" color={COLOR.YELLOW} size={24} />
      }}
    />
    <ToktokMallLandingBottomTab.Screen 
      name="Messages" 
      component={ToktokMallMessagesStackScreens} 
      options={{
        tabBarIcon: ({color}) => <AIcon name="mail" color={COLOR.YELLOW} size={24} />
      }}
    />
    <ToktokMallLandingBottomTab.Screen 
      name="Me" 
      component={ToktokMallMyProfileStackScreens} 
      options={{
        tabBarIcon: ({color}) => <AIcon name="user" color={COLOR.YELLOW} size={24} />
      }}
    />
  </ToktokMallLandingBottomTab.Navigator>
);

export default ({Navigator}) => <Navigator.Screen name="ToktokMallLanding" component={ToktokMallLanding} options={{headerShown: false}} />;
