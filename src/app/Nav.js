import React from 'react';
import {connect} from 'react-redux';
import {Image, Text, View, TouchableWithoutFeedback} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
// import {createFluidNavigator} from 'react-navigation-fluid-transitions';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import DrawerContent from './Drawer';
import {HeaderBack, HeaderTitle, BottomTabHeader} from '../components';
import {COLOR, MEDIUM, LIGHT} from '../res/constants';

import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import EIcon from 'react-native-vector-icons/Entypo';
import FIcon from 'react-native-vector-icons/Feather';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';

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
/*---------- COMMON SCREENS ----------*/
import TalkToUs from '../screens/AuthenticatedStack/CommonScreens/TalkToUs';
import Announcements from '../screens/AuthenticatedStack/CommonScreens/Announcement/Announcements';
import SelectedAnnouncement from '../screens/AuthenticatedStack/CommonScreens/Announcement/SelectedAnnouncement';
import Notifications from '../screens/AuthenticatedStack/CommonScreens/Notifications';
import DeliveryRating from '../screens/AuthenticatedStack/CommonScreens/DeliveryRating';
import OrderCancellation from '../screens/AuthenticatedStack/CommonScreens/OrderCancellation';

/*---------- CONSUMER SCREENS ----------*/
import PostRegistration from '../screens/AuthenticatedStack/ConsumerScreens/PostRegistration';

import ConsumerMap from '../screens/AuthenticatedStack/ConsumerScreens/Booking/ConsumerMap';
import SearchPlaces from '../screens/AuthenticatedStack/ConsumerScreens/Booking/SearchPlaces';
import SearchMap from '../screens/AuthenticatedStack/ConsumerScreens/Booking/SearchMap';
import SenderDetails from '../screens/AuthenticatedStack/ConsumerScreens/Booking/SenderDetails';
import RecipientDetails from '../screens/AuthenticatedStack/ConsumerScreens/Booking/RecipientDetails';

import ConsumerProfile from '../screens/AuthenticatedStack/ConsumerScreens/Profile/ConsumerProfile';
import ConsumerChangePassword from '../screens/AuthenticatedStack/ConsumerScreens/Profile/ConsumerChangePassword';

import CustomerDeliveries from '../screens/AuthenticatedStack/ConsumerScreens/Deliveries/MyDeliveries';
import SelectedDeliveries from '../screens/AuthenticatedStack/ConsumerScreens/Deliveries/SelectedDeliveries';
import SelectedDelivery from '../screens/AuthenticatedStack/ConsumerScreens/Deliveries/SelectedDelivery';
import DeliveryTracking from '../screens/AuthenticatedStack/ConsumerScreens/Deliveries/DeliveryTracking';

import SavedLocations from '../screens/AuthenticatedStack/ConsumerScreens/SavedLocations/SavedLocations';
import AddLocation from '../screens/AuthenticatedStack/ConsumerScreens/SavedLocations/AddLocation';

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
import DriverWalletLog from '../screens/AuthenticatedStack/DriverScreens/Wallet/DriverWalletHistory';
import Order from '../screens/AuthenticatedStack/DriverScreens/Orders/Order';

/*---------- DRIVER BOTTOM TAB ----------*/
import DriverSettings from '../screens/AuthenticatedStack/DriverScreens/DriverHomeBottomTab/DriverSettings';

/*-------------------- IMPORT SCREENS END--------------------*/

const Switch = createStackNavigator();
const Unauthenticated = createStackNavigator();
const Authenticated = createStackNavigator();
const RootDrawer = createDrawerNavigator();
const DriverHome = createBottomTabNavigator();
const DriverDeliveries = createMaterialTopTabNavigator();

const DriverDeliveriesTab = () => (
  <>
    <BottomTabHeader label={['My', 'Deliveries']} />
    <DriverDeliveries.Navigator
      swipeEnabled={false}
      upperCaseLabel={false}
      tabBarOptions={{
        activeTintColor: COLOR,
        inactiveTintColor: MEDIUM,
        allowFontScaling: false,
        indicatorStyle: {backgroundColor: COLOR},

        labelStyle: {
          fontWeight: 'bold',
          textTransform: 'none',
          fontSize: 16,
        },
      }}>
      <DriverDeliveries.Screen name="Ongoing" component={Ongoing} />
      <DriverDeliveries.Screen name="Completed" component={Completed} />
      <DriverDeliveries.Screen name="Cancelled" component={Cancelled} />
    </DriverDeliveries.Navigator>
  </>
);

const UnauthenticatedStack = () => (
  <Unauthenticated.Navigator>
    <Unauthenticated.Screen name="Login" component={Login} options={{headerShown: false}} />
    <Unauthenticated.Screen name="SmsVerification" component={SmsVerification} options={{headerShown: false}} />
    <Unauthenticated.Screen
      name="PasswordVerification"
      component={PasswordVerification}
      options={{headerShown: false}}
    />
    <Unauthenticated.Screen name="AccountBlocked" component={AccountBlocked} />
    <Unauthenticated.Screen name="ForgotPasswordRequest" component={ForgotPasswordRequest} />
    <Unauthenticated.Screen name="ForgotPasswordVerification" component={ForgotPasswordVerification} />
    <Unauthenticated.Screen name="ForgotPasswordReset" component={ForgotPasswordReset} />
  </Unauthenticated.Navigator>
);

const DriverHomeBottomTab = ({navigation}) => (
  <DriverHome.Navigator tabBarOptions={{activeTintColor: COLOR, inactiveTintColor: MEDIUM, showLabel: false}}>
    <DriverHome.Screen
      name="Order"
      component={Order}
      options={{
        // tabBarLabel: 'Orders',
        tabBarIcon: ({color}) => <MCIcon name="clipboard-text" color={color} size={26} />,
      }}
    />
    <Authenticated.Screen
      name="DriverDeliveriesTab"
      component={DriverDeliveriesTab}
      options={{
        headerLeft: () => <HeaderBack />,
        headerTitle: () => <HeaderTitle label={['My', 'Deliveries']} />,
      }}
      options={{
        tabBarIcon: ({color}) => <MCIcon name="map-marker-distance" color={color} size={26} />,
      }}
    />
    <DriverHome.Screen
      name="DriverWallet"
      component={DriverWallet}
      options={{
        tabBarIcon: ({color}) => <EIcon name="wallet" color={color} size={26} />,
      }}
    />
    {/* <DriverHome.Screen
      name="DriverProfile"
      component={DriverProfile}
      options={{
        tabBarIcon: ({color}) => <FAIcon name="user" color={color} size={26} />,
      }}
    /> */}
    <DriverHome.Screen
      name="DriverSettings"
      component={DriverSettings}
      options={{
        tabBarIcon: ({color}) => (
          <EIcon
            name="menu"
            color={color}
            size={26}
            onPress={() => navigation.openDrawer()}
            style={{paddingVertical: 12, paddingHorizontal: 20}}
          />
        ),
        tabBarButton: props => <TouchableWithoutFeedback {...props} onPress={() => navigation.openDrawer()} />,
      }}
    />
  </DriverHome.Navigator>
);

const AuthenticatedStack = () => (
  <Authenticated.Navigator>
    <Authenticated.Screen name="PostRegistration" component={PostRegistration} />

    <Authenticated.Screen name="ConsumerMap" component={ConsumerMap} options={{headerShown: false}} />
    <Authenticated.Screen name="SearchPlaces" component={SearchPlaces} />
    <Authenticated.Screen name="SearchMap" component={SearchMap} />
    <Authenticated.Screen name="SenderDetails" component={SenderDetails} />
    <Authenticated.Screen name="RecipientDetails" component={RecipientDetails} />

    <Authenticated.Screen name="Announcements" component={Announcements} />
    <Authenticated.Screen name="SelectedAnnouncement" component={SelectedAnnouncement} />
    <Authenticated.Screen name="DeliveryRating" component={DeliveryRating} />

    <Authenticated.Screen name="ConsumerProfile" component={ConsumerProfile} />
    <Authenticated.Screen name="ConsumerChangePassword" component={ConsumerChangePassword} />
    <Authenticated.Screen name="TalkToUs" component={TalkToUs} />
    <Authenticated.Screen name="OrderCancellation" component={OrderCancellation} />

    <Authenticated.Screen name="Notifications" component={Notifications} />

    <Authenticated.Screen name="CustomerDeliveries" component={CustomerDeliveries} />
    <Authenticated.Screen name="SelectedDeliveries" component={SelectedDeliveries} />
    <Authenticated.Screen name="SelectedDelivery" component={SelectedDelivery} />
    <Authenticated.Screen name="DeliveryTracking" component={DeliveryTracking} />

    <Authenticated.Screen name="SavedLocations" component={SavedLocations} />
    <Authenticated.Screen name="AddLocation" component={AddLocation} />

    {/*---------- DRIVER SCREENS ----------*/}
    <Authenticated.Screen name="DriverHomeBottomTab" component={DriverHomeBottomTab} options={{headerShown: false}} />

    <Authenticated.Screen name="DriverMap" component={DriverMap} />
    <Authenticated.Screen name="SelectedDriverDelivery" component={SelectedDriverDelivery} />
    <Authenticated.Screen name="ItemCamera" component={ItemCamera} />
    <Authenticated.Screen name="DriverProfile" component={DriverProfile} />
    <Authenticated.Screen name="ProfileCamera" component={ProfileCamera} />
    <Authenticated.Screen name="ChangeProfilePicture" component={ChangeProfilePicture} />
    <Authenticated.Screen name="DriverWallet" component={DriverWallet} />
    <Authenticated.Screen name="DriverWalletLog" component={DriverWalletLog} />
    <Authenticated.Screen name="Order" component={Order} />
    <Authenticated.Screen name="DriverDeliveriesTab" component={DriverDeliveriesTab} />
  </Authenticated.Navigator>
);

const mapStateToProps = state => ({
  session: state.session,
  constants: state.constants,
});

const mapDispatchToProps = dispatch => ({
  destroySession: () => dispatch({type: 'DESTROY_SESSION'}),
});

const Drawer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(({session, constants, destroySession}) => (
  <RootDrawer.Navigator
    drawerContent={({navigation}) => (
      <DrawerContent navigation={navigation} session={session} constants={constants} destroySession={destroySession} />
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
