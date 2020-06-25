import React from 'react';
import {connect} from 'react-redux';
import {Image, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
// import {createFluidNavigator} from 'react-navigation-fluid-transitions';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import DrawerContent from './Drawer';
import {HeaderBack, HeaderTitle} from '../components';
import {COLOR, MEDIUM, LIGHT} from '../res/constants';

/*-------------------- IMPORT SCREENS START--------------------*/
import Login from '../screens/UnauthenticatedStack/Login';
import SmsVerification from '../screens/UnauthenticatedStack/SmsVerification';
import PasswordVerification from '../screens/UnauthenticatedStack/PasswordVerification';
import AccountBlocked from '../screens/UnauthenticatedStack/AccountBlocked';
import ForgotPasswordRequest from '../screens/UnauthenticatedStack/ForgotPasswordRequest';
import ForgotPasswordVerification from '../screens/UnauthenticatedStack/ForgotPasswordVerification';
import ForgotPasswordReset from '../screens/UnauthenticatedStack/ForgotPasswordReset';

// Landing
import Landing from '../screens/Landing';

// Authenticated Stack
import TalkToUs from '../screens/AuthenticatedStack/CommonScreens/TalkToUs';

/*---------- CONSUMER SCREENS ----------*/
import PostRegistration from '../screens/AuthenticatedStack/ConsumerScreens/PostRegistration';

import ConsumerMap from '../screens/AuthenticatedStack/ConsumerScreens/Booking/ConsumerMap';
import SearchPlaces from '../screens/AuthenticatedStack/ConsumerScreens/Booking/SearchPlaces';
import SearchMap from '../screens/AuthenticatedStack/ConsumerScreens/Booking/SearchMap';
import SenderDetails from '../screens/AuthenticatedStack/ConsumerScreens/Booking/SenderDetails';
import RecipientDetails from '../screens/AuthenticatedStack/ConsumerScreens/Booking/RecipientDetails';

import Announcements from '../screens/AuthenticatedStack/ConsumerScreens/Announcement/Announcements';
import SelectedAnnouncement from '../screens/AuthenticatedStack/ConsumerScreens/Announcement/SelectedAnnouncement';

import ConsumerProfile from '../screens/AuthenticatedStack/ConsumerScreens/Profile/ConsumerProfile';
import ConsumerChangePassword from '../screens/AuthenticatedStack/ConsumerScreens/Profile/ConsumerChangePassword';
import Notifications from '../screens/AuthenticatedStack/ConsumerScreens/Notifications';

import CustomerDeliveries from '../screens/AuthenticatedStack/ConsumerScreens/Deliveries/MyDeliveries';
import SelectedDeliveries from '../screens/AuthenticatedStack/ConsumerScreens/Deliveries/SelectedDeliveries';
import SelectedDelivery from '../screens/AuthenticatedStack/ConsumerScreens/Deliveries/SelectedDelivery';

/*---------- DRIVER SCREENS ----------*/
import DriverMap from '../screens/AuthenticatedStack/DriverScreens/DriverMap';
import DriverProfile from '../screens/AuthenticatedStack/DriverScreens/Profile/DriverProfile';

import Ongoing from '../screens/AuthenticatedStack/DriverScreens/Deliveries/Ongoing';
import Completed from '../screens/AuthenticatedStack/DriverScreens/Deliveries/Completed';
import Cancelled from '../screens/AuthenticatedStack/DriverScreens/Deliveries/Cancelled';
import SelectedDriverDelivery from '../screens/AuthenticatedStack/DriverScreens/Deliveries/SelectedDriverDelivery';
import ItemCamera from '../screens/AuthenticatedStack/DriverScreens/Deliveries/ItemCamera';
import ProfileCamera from '../screens/AuthenticatedStack/DriverScreens/Profile/ProfileCamera';
import ChangeProfilePicture from '../screens/AuthenticatedStack/DriverScreens/Profile/ChangeProfilePicture';
import DriverWallet from '../screens/AuthenticatedStack/DriverScreens/Wallet/DriverWallet';
import DriverWalletLog from '../screens/AuthenticatedStack/DriverScreens/Wallet/DriverWalletLog';
import Order from '../screens/AuthenticatedStack/DriverScreens/Orders/Order';

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
  <Unauthenticated.Navigator>
    <Unauthenticated.Screen name="Login" component={Login} options={{header: () => <View />}} />
    <Unauthenticated.Screen name="SmsVerification" component={SmsVerification} options={{header: () => <View />}} />
    <Unauthenticated.Screen
      name="PasswordVerification"
      component={PasswordVerification}
      options={{header: () => <View />}}
    />
    <Unauthenticated.Screen name="AccountBlocked" component={AccountBlocked} />
    <Unauthenticated.Screen name="ForgotPasswordRequest" component={ForgotPasswordRequest} />
    <Unauthenticated.Screen name="ForgotPasswordVerification" component={ForgotPasswordVerification} />
    <Unauthenticated.Screen name="ForgotPasswordReset" component={ForgotPasswordReset} />
  </Unauthenticated.Navigator>
);

const AuthenticatedStack = () => (
  <Authenticated.Navigator>
    <Authenticated.Screen name="PostRegistration" component={PostRegistration} />

    <Authenticated.Screen name="ConsumerMap" component={ConsumerMap} />
    <Authenticated.Screen name="SearchPlaces" component={SearchPlaces} />
    <Authenticated.Screen name="SearchMap" component={SearchMap} />
    <Authenticated.Screen name="SenderDetails" component={SenderDetails} />
    <Authenticated.Screen name="RecipientDetails" component={RecipientDetails} />

    <Authenticated.Screen name="Announcements" component={Announcements} />
    <Authenticated.Screen name="SelectedAnnouncement" component={SelectedAnnouncement} />

    <Authenticated.Screen name="ConsumerProfile" component={ConsumerProfile} />
    <Authenticated.Screen name="ConsumerChangePassword" component={ConsumerChangePassword} />
    <Authenticated.Screen name="TalkToUs" component={TalkToUs} />

    <Authenticated.Screen name="Notifications" component={Notifications} />

    <Authenticated.Screen name="CustomerDeliveries" component={CustomerDeliveries} />
    <Authenticated.Screen name="SelectedDeliveries" component={SelectedDeliveries} />
    <Authenticated.Screen name="SelectedDelivery" component={SelectedDelivery} />

    {/*---------- DRIVER SCREENS ----------*/}
    <Authenticated.Screen name="DriverMap" component={DriverMap} />
    <Authenticated.Screen name="SelectedDriverDelivery" component={SelectedDriverDelivery} />
    <Authenticated.Screen name="ItemCamera" component={ItemCamera} />
    <Authenticated.Screen name="DriverProfile" component={DriverProfile} />
    <Authenticated.Screen name="ProfileCamera" component={ProfileCamera} />
    <Authenticated.Screen name="ChangeProfilePicture" component={ChangeProfilePicture} />
    <Authenticated.Screen name="DriverWallet" component={DriverWallet} />
    <Authenticated.Screen name="DriverWalletLog" component={DriverWalletLog} />
    <Authenticated.Screen name="Order" component={Order} />
    <Authenticated.Screen
      name="DriverDeliveriesTab"
      component={DriverDeliveriesTab}
      options={{
        headerLeft: () => <HeaderBack />,
        headerTitle: () => <HeaderTitle label={['My', 'Deliveries']} />,
      }}
    />
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

const SwitchStack = ({initialRoute}) => {
  return (
    <Switch.Navigator headerMode="none">
      <Switch.Screen name="Landing" component={Landing} options={{animationEnabled: false}} />
      <Switch.Screen name="UnauthenticatedStack" component={UnauthenticatedStack} />
      <Switch.Screen name="RootDrawer" component={Drawer} />
    </Switch.Navigator>
  );
};

const Nav = ({initialRoute}) => {
  return (
    <NavigationContainer>
      <SwitchStack initialRoute={initialRoute} />
    </NavigationContainer>
  );
};

// const mapDispatchToProps = dispatch => ({
//   destroySession: () => dispatch({type: 'DESTROY_SESSION'}),
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
