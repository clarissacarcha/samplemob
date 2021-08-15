import React from 'react';
import {View, Image, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {connect} from 'react-redux';
import { Badge } from 'react-native-elements';
import {COLOR, FONT, FONT_SIZE, SIZE} from '../../../res/variables';

import ToktokMallContextProvider from './ContextProvider';

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

const countCartItems = (myCart) => {
  let total = 0
  if(myCart == undefined){
    return ""
  }else {
    for(let x = 0; myCart.length >  x; x++){
      for(let y=0; myCart[x].cart.length > y; y++){
        total = total + 1
      }
    }
    if(total > 99){
      return "99+"
    }else {
      return total
    }
  }
}

const countNotifications = (notifs) => {
  let total = 0
  if(!notifs) return ""
  else{
    notifs.map(item => {
      if(item.read == 0) total += 1
    })
    return total
  }
}

const RenderBadge = ({data}) => {
  if(data == 0 || data == ""){
    return (
      <Badge
        status="warning"
        containerStyle={{
          position: 'absolute',
          top: 2,
          right: 2,
          left: 16
        }}
        textStyle={{
          fontFamily: FONT.REGULAR,
          fontSize: 9
        }}
      />
    )
  }else{
    return (
      <Badge
        value={data}
        status="warning"
        containerStyle={{
          position: 'absolute',
          top: -4,
          right: 14
        }}
        textStyle={{
          fontFamily: FONT.REGULAR,
          fontSize: 9
        }}
      />
    )
  }
}

const TabBarIcon = ({source, myCart, notifs, tab}) => {
  return (
    <>
      <Image source={source} style={BottomTabImageIconStyle} />
      {/* <View
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
        {tab == 'cart' ? 
          <Text style={{color: 'white', fontSize: 10}}>{countCartItems(myCart)}</Text>
          :
          <Text style={{color: 'white', fontSize: 10}}>99+</Text>
        }
      </View> */}
      <RenderBadge data={tab == 'cart' ? countCartItems(myCart) : countNotifications(notifs)} />
      {/* <Badge
        // value={tab == 'cart' ? countCartItems(myCart) : countNotifications(notifs)}

        status="warning"
        containerStyle={{
          position: 'absolute',
          top: -4,
          right: 14
        }}
        textStyle={{
          fontFamily: FONT.REGULAR,
          fontSize: 11
        }}
      /> */}
    </>
  );
};

const mapStateToProps = (state) => ({
  myCart: state.toktokMall.myCart,
  notifications: state.toktokMall.notifications
})

const ToktokMallLanding = connect(
  mapStateToProps,
  null,
)(({myCart, notifications}) => {

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
          focused ? <TabBarIcon source={cartIconFill} myCart={myCart} tab={'cart'} /> : <TabBarIcon source={cartIconOutline} myCart={myCart} tab={'cart'} />,
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
          focused ? <TabBarIcon source={notifIconFill} notifs={notifications} tab={'notifs'} /> : <TabBarIcon source={notifIconOutline} notifs={notifications} tab={'notifs'} />,
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
});

export default ({Navigator}) => (
  <Navigator.Screen 
    name="ToktokMallLanding" 
    component={ToktokMallLanding} 
    options={{headerShown: false}} 
  />
);
