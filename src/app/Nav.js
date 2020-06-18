import React from 'react';
import {connect} from 'react-redux';
import {Image, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
// import {createFluidNavigator} from 'react-navigation-fluid-transitions';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import DrawerContent from './Drawer';
import {HeaderBack, HeaderTitle} from '../components';
import {COLOR, MEDIUM, LIGHT} from '../res/constants';

/*-------------------- IMPORT SCREENS START--------------------*/
import Login from '../screens/UnauthenticatedStack/Login';
import Verification from '../screens/UnauthenticatedStack/Verification';

// Authenticated Stack
import PostRegistration from '../screens/AuthenticatedStack/PostRegistration';
import Map from '../screens/AuthenticatedStack/Map';
import SearchPlaces from '../screens/AuthenticatedStack/SearchPlaces';
import SearchMap from '../screens/AuthenticatedStack/SearchMap';

import SenderDetails from '../screens/AuthenticatedStack/DeliveryBooking/SenderDetails';
import RecipientDetails from '../screens/AuthenticatedStack/DeliveryBooking/RecipientDetails';

import CustomerProfile from '../screens/AuthenticatedStack/CustomerProfile';
import TalkToUs from '../screens/AuthenticatedStack/TalkToUs';
import Announcements from '../screens/AuthenticatedStack/Announcements';
import SelectedAnnouncement from '../screens/AuthenticatedStack/SelectedAnnouncement';

import CustomerDeliveries from '../screens/AuthenticatedStack/CustomerDeliveries/MyDeliveries';
import SelectedDeliveries from '../screens/AuthenticatedStack/CustomerDeliveries/SelectedDeliveries';
import SelectedDelivery from '../screens/AuthenticatedStack/CustomerDeliveries/SelectedDelivery';

/*---------- DRIVER SCREENS ----------*/
import DriverMap from '../screens/AuthenticatedStack/DriverMap';
import Ongoing from '../screens/AuthenticatedStack/DriverDeliveries/Ongoing';
import Completed from '../screens/AuthenticatedStack/DriverDeliveries/Completed';
import Cancelled from '../screens/AuthenticatedStack/DriverDeliveries/Cancelled';
import SelectedDriverDelivery from '../screens/AuthenticatedStack/DriverDeliveries/SelectedDriverDelivery';
import ItemCamera from '../screens/AuthenticatedStack/DriverDeliveries/ItemCamera';

/*-------------------- IMPORT SCREENS END--------------------*/

const Switch = createStackNavigator();
const Unauthenticated = createStackNavigator();
const Authenticated = createStackNavigator();
const RootDrawer = createDrawerNavigator();
const DriverDeliveries = createMaterialTopTabNavigator();

const DriverDeliveriesTab = () => (
  <DriverDeliveries.Navigator
    tabBarOptions={{
      activeTintColor: COLOR,
      inactiveTintColor: LIGHT,
      allowFontScaling: false,
      indicatorStyle: {backgroundColor: COLOR},
      labelStyle: {
        fontWeight: 'bold',
      },
    }}>
    <DriverDeliveries.Screen name="Ongoing" component={Ongoing} />
    <DriverDeliveries.Screen name="Completed" component={Completed} />
    <DriverDeliveries.Screen name="Cancelled" component={Cancelled} />
  </DriverDeliveries.Navigator>
);

const UnauthenticatedStack = () => (
  <Unauthenticated.Navigator headerMode="none">
    <Unauthenticated.Screen name="Login" component={Login} />
    <Unauthenticated.Screen name="Verification" component={Verification} />
  </Unauthenticated.Navigator>
);

const AuthenticatedStack = () => (
  <Authenticated.Navigator>
    <Authenticated.Screen name="PostRegistration" component={PostRegistration} />
    <Authenticated.Screen name="Map" component={Map} />
    <Authenticated.Screen name="SearchPlaces" component={SearchPlaces} />
    <Authenticated.Screen name="SearchMap" component={SearchMap} />
    <Authenticated.Screen name="SenderDetails" component={SenderDetails} />
    <Authenticated.Screen name="RecipientDetails" component={RecipientDetails} />

    <Authenticated.Screen name="CustomerProfile" component={CustomerProfile} />
    <Authenticated.Screen name="TalkToUs" component={TalkToUs} />
    <Authenticated.Screen name="Announcements" component={Announcements} />
    <Authenticated.Screen name="SelectedAnnouncement" component={SelectedAnnouncement} />

    <Authenticated.Screen name="CustomerDeliveries" component={CustomerDeliveries} />
    <Authenticated.Screen name="SelectedDeliveries" component={SelectedDeliveries} />
    <Authenticated.Screen name="SelectedDelivery" component={SelectedDelivery} />

    <Authenticated.Screen name="DriverMap" component={DriverMap} />
    <Authenticated.Screen
      name="DriverDeliveriesTab"
      component={DriverDeliveriesTab}
      options={{
        headerLeft: () => <HeaderBack />,
        headerTitle: () => <HeaderTitle label={['My', 'Deliveries']} />,
      }}
    />
    <Authenticated.Screen name="SelectedDriverDelivery" component={SelectedDriverDelivery} />
    <Authenticated.Screen name="ItemCamera" component={ItemCamera} />
  </Authenticated.Navigator>
);

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  destroySession: () => dispatch({type: 'DESTROY_SESSION'}),
});

const Drawer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(({session, destroySession}) => (
  <RootDrawer.Navigator
    drawerContent={({navigation}) => (
      <DrawerContent navigation={navigation} session={session} destroySession={destroySession} />
    )}>
    <RootDrawer.Screen name="AuthenticatedStack" component={AuthenticatedStack} />
  </RootDrawer.Navigator>
));

const SwitchStack = ({initialRoute}) => (
  <Switch.Navigator headerMode="none" initialRoute={initialRoute}>
    <Switch.Screen name="UnauthenticatedStack" component={UnauthenticatedStack} />
    <Switch.Screen name="RootDrawer" component={Drawer} />
  </Switch.Navigator>
);

const Nav = ({initialRoute}) => {
  return (
    <NavigationContainer>
      <SwitchStack initialRoute={initialRoute} />
    </NavigationContainer>
  );
};

// const mapStateToProps = state => ({
//   session: state.session,
//   nav: state.nav,
// });

// const mapDispatchToProps = dispatch => ({
//   destroySession: () => dispatch({type: 'DESTROY_SESSION'}),
//   createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
//   startLoading: () => dispatch({type: 'START_LOADING'}),
//   finishLoading: () => dispatch({type: 'FINISH_LOADING'}),
//   setConstants: payload => dispatch({type: 'SET_CONSTANTS', payload}),
// });

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(Nav);

export default Nav;
