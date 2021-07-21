import React from 'react';
import {View, Image, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {COLOR, FONT_SIZE, SIZE} from '../../../res/variables';

import {
  //Categories
  ToktokMallCategoriesSearch,

  //Home
  ToktokMallLandingScreen,

  //Notifications
  ToktokMallNotifications,

  //My Cart
  ToktokMallMyCart,

  //My Profile
  ToktokMallMyProfileHome,
} from '../../../ToktokMall/screens';


const ToktokMallLandingBottomTab = createBottomTabNavigator();

const cartIconOutline = require('../../../ToktokMall/assets/icons/cart-outline.png');
const categoriesIconOutline = require('../../../ToktokMall/assets/icons/categories-outline.png');
const homeIconOutline = require('../../../ToktokMall/assets/icons/home-outline.png');
const notifIconOutline = require('../../../ToktokMall/assets/icons/bell-outline.png');
const userIconOutline = require('../../../ToktokMall/assets/icons/me-outline.png');

const homeIconFill = require('../../../ToktokMall/assets/icons/home-fill.png');
const cartIconFill = require('../../../ToktokMall/assets/icons/cart-fill.png');
const categoriesIconFill = require('../../../ToktokMall/assets/icons/categories-fill.png');
const notifIconFill = require('../../../ToktokMall/assets/icons/bell-fill.png');
const userIconFill = require('../../../ToktokMall/assets/icons/me-fill.png');

const BottomTabImageIconStyle = {
  width: 18,
  height: 20,
  resizeMode: 'stretch',
};

const TabBarIcon = ({source}) => {
  return (
    <>
      <Image source={source} style={BottomTabImageIconStyle} />
      <View
        style={{
          position: 'absolute',
          right: 13,
          top: -2,
          backgroundColor: COLOR.YELLOW,
          borderRadius: 9,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 2,
        }}>
        <Text style={{color: 'white', fontSize: 10}}>99+</Text>
      </View>
    </>
  );
};

const ToktokMallLanding = ({Navigator}) => {

  return (
  <ToktokMallLandingBottomTab.Navigator
    initialRouteName="ToktokMallHome"
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
        paddingVertical: 12,
      },
      style: {
        height: 65,
      },
    }}>
    <ToktokMallLandingBottomTab.Screen
      name="ToktokMallMyCart"
      component={ToktokMallMyCart}
      options={{
        tabBarLabel: 'My Cart',
        // tabBarIcon: ({color}) => <AIcon name="shoppingcart" color={COLOR.YELLOW} size={24} />
        // tabBarIcon: ({focused}) => focused ? <Image source={cartIconFill} style={BottomTabImageIconStyle} /> : <Image source={cartIconOutline} style={BottomTabImageIconStyle} />
        tabBarIcon: ({focused}) =>
          focused ? <TabBarIcon source={cartIconFill} /> : <TabBarIcon source={cartIconOutline} />,
      }}
    />
    <ToktokMallLandingBottomTab.Screen
      name="ToktokMallCategories"
      component={ToktokMallCategoriesSearch}
      options={{
        tabBarLabel: 'Categories',
        // tabBarIcon: ({color}) => <AIcon name="profile" color={COLOR.YELLOW} size={24} />
        tabBarIcon: ({focused}) =>
          focused ? (
            <Image source={categoriesIconFill} style={BottomTabImageIconStyle} />
          ) : (
            <Image source={categoriesIconOutline} style={BottomTabImageIconStyle} />
          ),
      }}
    />
    <ToktokMallLandingBottomTab.Screen
      name="ToktokMallHome"
      component={ToktokMallLandingScreen}
      options={{
        tabBarBadge: '99+',
        tabBarLabel: 'toktokmall',
        // tabBarIcon: ({color}) => <FoIcon name="shopping-bag-1" color={COLOR.YELLOW} size={24} />
        tabBarIcon: ({focused}) =>
          focused ? (
            <Image source={homeIconFill} style={BottomTabImageIconStyle} />
          ) : (
            <Image source={homeIconOutline} style={BottomTabImageIconStyle} />
          ),
      }}
    />
    <ToktokMallLandingBottomTab.Screen
      name="ToktokMallNotifications"
      component={ToktokMallNotifications}
      options={{
        tabBarLabel: 'Notifications',
        // tabBarIcon: ({color}) => <AIcon name="mail" color={COLOR.YELLOW} size={24} />
        // tabBarIcon: ({focused}) => focused ? <Image source={messageIconFill} style={BottomTabImageIconStyle} /> : <Image source={messagesIconOutline} style={BottomTabImageIconStyle} />
        tabBarIcon: ({focused}) =>
          focused ? <TabBarIcon source={notifIconFill} /> : <TabBarIcon source={notifIconOutline} />,
      }}
    />
    <ToktokMallLandingBottomTab.Screen
      name="ToktokMallMyProfile"
      component={ToktokMallMyProfileHome}
      options={{
        tabBarLabel: 'Me',
        // tabBarIcon: ({color}) => <AIcon name="user" color={COLOR.YELLOW} size={24} />
        tabBarIcon: ({focused}) =>
          focused ? (
            <Image source={userIconFill} style={BottomTabImageIconStyle} />
          ) : (
            <Image source={userIconOutline} style={BottomTabImageIconStyle} />
          ),
      }}
    />
  </ToktokMallLandingBottomTab.Navigator>
  )
};

export default ({Navigator}) => (
  <Navigator.Screen 
    name="ToktokMallLanding" 
    component={ToktokMallLanding} 
    options={{headerShown: false}} 
  />
);
