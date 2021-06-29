import React from 'react';
import {View, Image, Text} from 'react-native';
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
  // ToktokMallMessageHome,
  // ToktokMallMessageConvo,

  //Notifications
  ToktokMallNotifications,

  //My Cart
  ToktokMallMyCart,

  //My Profile
  ToktokMallHelp,
  ToktokMallMyFollowing,
  ToktokMallMyVouchers,
  ToktokMallMyOrders,
  ToktokMallMyProfileHome,
  ToktokMallMyWishlist

 } from '../../../ToktokMall/screens';

const ToktokMallLandingBottomTab = createBottomTabNavigator();

const ToktokMallCartStack = createStackNavigator();
const ToktokMallCategoriesStack = createStackNavigator();
const ToktokMallHomeStack = createStackNavigator();
const ToktokMallNotificationStack = createStackNavigator();
const ToktokMallMyProfileStack = createStackNavigator();

const ToktokMallCartStackScreens = () => (
  <ToktokMallCartStack.Navigator initialRouteName="ToktokMallNotifications">
    <ToktokMallCartStack.Screen
      name="ToktokMallMyCart"
      component={ToktokMallMyCart}
    />
  </ToktokMallCartStack.Navigator>
);

const ToktokMallCategoriesStackScreen = () => (
  <ToktokMallCategoriesStack.Navigator initialRouteName="ToktokMallCategoriesSearch">
    <ToktokMallCategoriesStack.Screen
      name="ToktokMallCategoriesSearch"
      component={ToktokMallCategoriesSearch}
    />
    <ToktokMallCategoriesStack.Screen
      name="ToktokMallCategoriesList"
      component={ToktokMallCategoriesList}
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

const ToktokMallNotificationStackScreens = () => (
  <ToktokMallNotificationStack.Navigator initialRouteName="ToktokMallNotifications">
    <ToktokMallNotificationStack.Screen
      name="ToktokMallNotifications"
      component={ToktokMallNotifications}
    />
  </ToktokMallNotificationStack.Navigator>
);

const ToktokMallMyProfileStackScreens = () => (
  <ToktokMallMyProfileStack.Navigator initialRouteName="ToktokMallMyProfileHome">
    <ToktokMallMyProfileStack.Screen
      name="ToktokMallMyProfileHome"
      component={ToktokMallMyProfileHome}
      options={{
        headerShown: false,
      }}
    />
    {/* <ToktokMallMyProfileStack.Screen
      name="ToktokMallMyOrders"
      component={ToktokMallMyOrders}
      options={{
        headerShown: false,
      }}
    /> */}
    <ToktokMallMyProfileStack.Screen
      name="ToktokMallMyFollowing"
      component={ToktokMallMyFollowing}
    />
    <ToktokMallMyProfileStack.Screen
      name="ToktokMallMyVouchers"
      component={ToktokMallMyVouchers}      
    />
    <ToktokMallMyProfileStack.Screen
      name="ToktokMallHelp"
      component={ToktokMallHelp}
    />
    <ToktokMallMyProfileStack.Screen
      name="ToktokMallMyWishlist"
      component={ToktokMallMyWishlist}
    />    
  </ToktokMallMyProfileStack.Navigator>
);

const cartIconOutline = require("../../../assets/toktokmall-assets/icons/cart-outline.png")
const categoriesIconOutline = require("../../../assets/toktokmall-assets/icons/categories-outline.png")
const homeIconOutline = require("../../../assets/toktokmall-assets/icons/home-outline.png")
const notifIconOutline = require("../../../assets/toktokmall-assets/icons/bell-outline.png")
const userIconOutline = require("../../../assets/toktokmall-assets/icons/me-outline.png")

const homeIconFill = require("../../../assets/toktokmall-assets/icons/home-fill.png")
const cartIconFill = require("../../../assets/toktokmall-assets/icons/cart-fill.png")
const categoriesIconFill = require("../../../assets/toktokmall-assets/icons/categories-fill.png")
const notifIconFill = require("../../../assets/toktokmall-assets/icons/bell-fill.png")
const userIconFill = require("../../../assets/toktokmall-assets/icons/me-fill.png")

const BottomTabImageIconStyle = {
  width: 18, height: 20, resizeMode: 'stretch'
}

const TabBarIcon = ({source}) => {
  return (
    <>
      <Image source={source} style={BottomTabImageIconStyle} />
      <View style={{ position: 'absolute', right: 13, top: -2, backgroundColor: COLOR.YELLOW, borderRadius: 9, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 2 }}>
        <Text style={{ color: 'white', fontSize: 10}}>99+</Text>
      </View>
    </>
  )
}

const ToktokMallLanding = () => (
  <ToktokMallLandingBottomTab.Navigator 
    initialRouteName="ToktokMallHome" 
    screenOptions={{headerShown: false, headerMode: "none"}}
    tabBarOptions={{
      activeTintColor: COLOR.DARK,
      inactiveTintColor: COLOR.DARK,
      allowFontScaling: false,
      indicatorStyle: {backgroundColor: COLOR.YELLOW},
      labelStyle: {
        fontFamily: 'Rubik-Regular',
        textTransform: 'none',
        fontSize: 10,
      },
      tabStyle: {
        paddingVertical: 12
      },
      style: {
        height: 65
      }
    }}
  >
    <ToktokMallLandingBottomTab.Screen 
      name="ToktokMallMyCart" 
      component={ToktokMallCartStackScreens} 
      options={{
        tabBarLabel: "My Cart",
        // tabBarIcon: ({color}) => <AIcon name="shoppingcart" color={COLOR.YELLOW} size={24} /> 
        // tabBarIcon: ({focused}) => focused ? <Image source={cartIconFill} style={BottomTabImageIconStyle} /> : <Image source={cartIconOutline} style={BottomTabImageIconStyle} />
        tabBarIcon: ({focused}) => focused ? <TabBarIcon source={cartIconFill} /> : <TabBarIcon source={cartIconOutline} />
      }}
    />
    <ToktokMallLandingBottomTab.Screen 
      name="ToktokMallCategories" 
      component={ToktokMallCategoriesStackScreen} 
      options={{
        tabBarLabel: "Categories",
        // tabBarIcon: ({color}) => <AIcon name="profile" color={COLOR.YELLOW} size={24} />
        tabBarIcon: ({focused}) => focused ? <Image source={categoriesIconFill} style={BottomTabImageIconStyle} /> : <Image source={categoriesIconOutline} style={BottomTabImageIconStyle} />
      }}
    />
    <ToktokMallLandingBottomTab.Screen 
      name="ToktokMallHome" 
      component={ToktokMallHomeStackScreens} 
      options={{
        tabBarBadge: "99+",
        tabBarLabel: "toktokmall",
        // tabBarIcon: ({color}) => <FoIcon name="shopping-bag-1" color={COLOR.YELLOW} size={24} />
        tabBarIcon: ({focused}) => focused ? <Image source={homeIconFill} style={BottomTabImageIconStyle} /> : <Image source={homeIconOutline} style={BottomTabImageIconStyle} />
      }}
    />
    <ToktokMallLandingBottomTab.Screen 
      name="ToktokMallNotifications" 
      component={ToktokMallNotificationStackScreens} 
      options={{
        tabBarLabel: "Notifications",
        // tabBarIcon: ({color}) => <AIcon name="mail" color={COLOR.YELLOW} size={24} />
        // tabBarIcon: ({focused}) => focused ? <Image source={messageIconFill} style={BottomTabImageIconStyle} /> : <Image source={messagesIconOutline} style={BottomTabImageIconStyle} />
        tabBarIcon: ({focused}) => focused ? <TabBarIcon source={notifIconFill} /> : <TabBarIcon source={notifIconOutline} />
      }}
    />
    <ToktokMallLandingBottomTab.Screen 
      name="ToktokMallMyProfile" 
      component={ToktokMallMyProfileStackScreens} 
      options={{
        tabBarLabel: "Me",
        // tabBarIcon: ({color}) => <AIcon name="user" color={COLOR.YELLOW} size={24} />
        tabBarIcon: ({focused}) => focused ? <Image source={userIconFill} style={BottomTabImageIconStyle} /> : <Image source={userIconOutline} style={BottomTabImageIconStyle} />
      }}
    />
  </ToktokMallLandingBottomTab.Navigator>
);

export default ({Navigator}) => <Navigator.Screen name="ToktokMallLanding" component={ToktokMallLanding} options={{headerShown: false}} />;
