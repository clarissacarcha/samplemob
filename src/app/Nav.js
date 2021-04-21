import React from 'react';
import {connect} from 'react-redux';
import {COLOR, MEDIUM} from '../res/constants';
import {DeliveriesTopTabHeader} from '../components';
import EIcon from 'react-native-vector-icons/Entypo';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {NavigationContainer} from '@react-navigation/native';
import {TouchableWithoutFeedback} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createStackNavigator} from '@react-navigation/stack';

/*-------------------- IMPORT SCREENS START--------------------*/
import DrawerContent from './Drawer';
import Landing from '../screens/Landing';

/*---------- CONSUMER SCREENS ----------*/

import ConsumerLanding from '../screens/AuthenticatedStack/ConsumerScreens/ConsumerLanding';
import ToktokDelivery from '../screens/AuthenticatedStack/ConsumerScreens/DeliveryScreens/ToktokDelivery';
import StopDetails from '../screens/AuthenticatedStack/ConsumerScreens/DeliveryScreens/StopDetails';
import DeliveryDetails from '../screens/AuthenticatedStack/ConsumerScreens/DeliveryScreens/DeliveryDetails';
import DeliverySummary from '../screens/AuthenticatedStack/ConsumerScreens/DeliveryScreens/DeliverySummary';

import PostRegistration from '../screens/AuthenticatedStack/ConsumerScreens/PostRegistration';
import CheckConsumerLocation from '../screens/AuthenticatedStack/ConsumerScreens/Booking/CheckConsumerLocation';
// import StopDetails from '../screens/AuthenticatedStack/ConsumerScreens/Booking/StopDetails';
import ConsumerMap from '../screens/AuthenticatedStack/ConsumerScreens/Booking/ConsumerMap';
import RecipientDetails from '../screens/AuthenticatedStack/ConsumerScreens/Booking/RecipientDetails';
// import DeliveryDetails from '../screens/AuthenticatedStack/ConsumerScreens/Booking/DeliveryDetails';
import SavedLocations from '../screens/AuthenticatedStack/ConsumerScreens/SavedLocations/SavedLocations';
import SearchMap from '../screens/AuthenticatedStack/ConsumerScreens/Booking/SearchMap';
import SearchPlaces from '../screens/AuthenticatedStack/ConsumerScreens/Booking/SearchPlaces';
import SelectedDeliveries from '../screens/AuthenticatedStack/ConsumerScreens/Deliveries/SelectedDeliveries';
import SelectedDelivery from '../screens/AuthenticatedStack/ConsumerScreens/Deliveries/SelectedDelivery';
import SenderDetails from '../screens/AuthenticatedStack/ConsumerScreens/Booking/SenderDetails';
import AddLocation from '../screens/AuthenticatedStack/ConsumerScreens/SavedLocations/AddLocation';
import ConsumerChangePassword from '../screens/AuthenticatedStack/ConsumerScreens/Profile/ConsumerChangePassword';

import ConsumerProfile from '../screens/AuthenticatedStack/ConsumerScreens/Profile/ConsumerProfile';
import CustomerDeliveries from '../screens/AuthenticatedStack/ConsumerScreens/Deliveries/MyDeliveries';
import DeliveryTracking from '../screens/AuthenticatedStack/ConsumerScreens/Deliveries/DeliveryTracking';
import SearchContact from '../screens/AuthenticatedStack/ConsumerScreens/Booking/SearchContact';

/*---------- CONSUMER TOKTOK WALLET SCREENS ----------*/
import Wallet from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/WalletComponent';
import WalletRestrictedScreen from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/WalletComponent/RestrictedScreen';
import WalletSecurityAndPrivacy from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/WalletComponent/SecurityAndPrivacy';

import PaymentOptions from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/CashIn/PaymentOptions';
import PayPanda from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/CashIn/PayPanda/PayPandaComponent';
import PayPandaWebView from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/CashIn/PayPanda/WebViewComponent';
import WalletSettings from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/Settings';
import CashInLogs from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/CashIn/CashInLogs';
import CashOutLogs from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/Cashout/CashOutLogs';
import WalletSettingsPinCode from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/Pincode';
import WalletPinCodeSecurity from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/Pincode/PincodeSecurity';
import WalletForgotPincode from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/Pincode/Recovery/ForgotPin';
import WalletRecoverPincode from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/Pincode/Recovery/RecoverPin';
import WalletRecoverUpdatePincode from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/Pincode/Recovery/UpdatePin';
import WalletVerifyUser from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/VerifyUser/VerifyUser';
import WalletVerifyUserSetup from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/VerifyUser/Setup';
import WalletValidIDCamera from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/VerifyUser/ValidIDCamera';
import WalletSelfieCamera from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/VerifyUser/SelfieCamera';
import WalletSelfieImageCamera from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/VerifyUser/SelfieImageCamera';

import WalletSendMoney from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/Actions/SendMoney';
import WalletContacts from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/Actions/SendMoney/WalletContacts';

import WalletActionsRequest from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/Actions/Request/RequestWalletComponent';
import WalletActionsScantoPay from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/Actions/ScantoPay/ScantoPayWalletComponent';
import WalletActionsScantoPayConfirmPayment from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/Actions/ScantoPay/ConfirmPayment';
import WalletCashout from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/Cashout/Cashout';
import WalletGcashEncashment from '../screens/AuthenticatedStack/ConsumerScreens/Wallet/Cashout/Gcash/GcashEncashment';

/*---------- DRIVER SCREENS ----------*/
import DriverMap from '../screens/AuthenticatedStack/DriverScreens/DriverMap';
import Ongoing from '../screens/AuthenticatedStack/DriverScreens/Deliveries/Ongoing';
import Order from '../screens/AuthenticatedStack/DriverScreens/Orders/Order';
import Pending from '../screens/AuthenticatedStack/DriverScreens/Deliveries/Pending';
import DriverProfile from '../screens/AuthenticatedStack/DriverScreens/Profile/DriverProfile';
import DriverWallet from '../screens/AuthenticatedStack/DriverScreens/Wallet/DriverWallet';
import DriverWalletLog from '../screens/AuthenticatedStack/DriverScreens/Wallet/DriverWalletHistory';
import ToktokWalletHistory from '../screens/AuthenticatedStack/DriverScreens/Wallet/ToktokWalletHistory';
import ItemCamera from '../screens/AuthenticatedStack/DriverScreens/Deliveries/ItemCamera';
import DriverSettings from '../screens/AuthenticatedStack/DriverScreens/DriverHomeBottomTab/DriverSettings';
import SelectedDriverDelivery from '../screens/AuthenticatedStack/DriverScreens/Deliveries/SelectedDriverDelivery';
import SearchLocationFilter from '../screens/AuthenticatedStack/DriverScreens/Orders/SearchLocationFilter';
import ProfileCamera from '../screens/AuthenticatedStack/DriverScreens/Profile/ProfileCamera';
import Cancelled from '../screens/AuthenticatedStack/DriverScreens/Deliveries/Cancelled';
import Completed from '../screens/AuthenticatedStack/DriverScreens/Deliveries/Completed';
import ChangeProfilePicture from '../screens/AuthenticatedStack/DriverScreens/Profile/ChangeProfilePicture';

/*---------- COMMON SCREENS ----------*/
import SelectedAnnouncement from '../screens/AuthenticatedStack/CommonScreens/Announcement/SelectedAnnouncement';
import TalkToUs from '../screens/AuthenticatedStack/CommonScreens/TalkToUs';
import OrderCancellation from '../screens/AuthenticatedStack/CommonScreens/OrderCancellation';
import Notifications from '../screens/AuthenticatedStack/CommonScreens/Notifications';
import DeliveryRating from '../screens/AuthenticatedStack/CommonScreens/DeliveryRating';
import Announcements from '../screens/AuthenticatedStack/CommonScreens/Announcement/Announcements';
import GCashAccount from '../screens/AuthenticatedStack/CommonScreens/GCashAccount';

/*---------- Unauthenticated Stack ----------*/
import AccountBlocked from '../screens/UnauthenticatedStack/AccountBlocked';
import Login from '../screens/UnauthenticatedStack/Login';
import SmsVerification from '../screens/UnauthenticatedStack/SmsVerification';
import PasswordVerification from '../screens/UnauthenticatedStack/PasswordVerification';
import ForgotPasswordReset from '../screens/UnauthenticatedStack/ForgotPasswordReset';
import ForgotPasswordRequest from '../screens/UnauthenticatedStack/ForgotPasswordRequest';
import ForgotPasswordVerification from '../screens/UnauthenticatedStack/ForgotPasswordVerification';

/*-------------------- IMPORT SCREENS END--------------------*/

const Switch = createStackNavigator();
const Unauthenticated = createStackNavigator();
const Authenticated = createStackNavigator();
const RootDrawer = createDrawerNavigator();
const DriverHome = createBottomTabNavigator();
const ConsumerHome = createBottomTabNavigator();
const DriverDeliveries = createMaterialTopTabNavigator();

const DriverDeliveriesTab = () => {
  return (
    <>
      <DeliveriesTopTabHeader />
      <DriverDeliveries.Navigator
        swipeEnabled={false}
        upperCaseLabel={false}
        tabBarOptions={{
          activeTintColor: COLOR,
          inactiveTintColor: MEDIUM,
          allowFontScaling: false,
          indicatorStyle: {backgroundColor: COLOR},

          labelStyle: {
            fontFamily: 'Rubik-Regular',
            textTransform: 'none',
            fontSize: 14,
          },
        }}>
        <DriverDeliveries.Screen
          name="Ongoing"
          component={Ongoing}
          options={() => ({
            tabBarLabel: ({focused}) => {
              const iconColor = focused ? COLOR : MEDIUM;
              return <EIcon name="time-slot" color={iconColor} size={20} />;
            },
          })}
        />
        <DriverDeliveries.Screen
          name="Pending"
          component={Pending}
          options={() => ({
            tabBarLabel: ({focused}) => {
              const iconColor = focused ? COLOR : MEDIUM;
              return <FAIcon name="refresh" color={iconColor} size={20} />;
            },
          })}
        />
        <DriverDeliveries.Screen
          name="Completed"
          component={Completed}
          options={() => ({
            tabBarLabel: ({focused}) => {
              const iconColor = focused ? COLOR : MEDIUM;
              return <FA5Icon name="check" color={iconColor} size={20} />;
            },
          })}
        />
        <DriverDeliveries.Screen
          name="Cancelled"
          component={Cancelled}
          options={() => ({
            tabBarLabel: ({focused}) => {
              const iconColor = focused ? COLOR : MEDIUM;
              return <FA5Icon name="times" color={iconColor} size={22} />;
            },
          })}
        />
      </DriverDeliveries.Navigator>
    </>
  );
};

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
      // options={{
      //   headerLeft: () => <HeaderBack />,
      //   headerTitle: () => <HeaderTitle label={['My', 'Deliveries']} />,
      // }}
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
        tabBarButton: (props) => <TouchableWithoutFeedback {...props} onPress={() => navigation.openDrawer()} />,
      }}
    />
  </DriverHome.Navigator>
);

const ConsumerHomeBottomTab = ({navigation}) => (
  <ConsumerHome.Navigator tabBarOptions={{activeTintColor: COLOR, inactiveTintColor: MEDIUM, showLabel: false}}>
    <ConsumerHome.Screen
      name="ConsumerHome"
      component={ConsumerLanding}
      options={{
        // tabBarLabel: 'Orders',
        tabBarIcon: ({color}) => <MCIcon name="home" color={color} size={26} />,
      }}
    />
    <ConsumerHome.Screen
      name="ConsumerHome2"
      component={CustomerDeliveries}
      // options={{
      //   headerLeft: () => <HeaderBack />,
      //   headerTitle: () => <HeaderTitle label={['My', 'Deliveries']} />,
      // }}
      options={{
        tabBarIcon: ({color}) => <MCIcon name="map-marker-distance" color={color} size={26} />,
      }}
    />
    <ConsumerHome.Screen
      name="ConsumerHome3"
      component={ConsumerProfile}
      options={{
        tabBarIcon: ({color}) => <MCIcon name="account-circle" color={color} size={26} />,
      }}
    />
    <ConsumerHome.Screen
      name="ConsumerHome4"
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
        tabBarButton: (props) => <TouchableWithoutFeedback {...props} onPress={() => navigation.openDrawer()} />,
      }}
    />
  </ConsumerHome.Navigator>
);

const AuthenticatedStack = () => (
  <Authenticated.Navigator>
    {/* <Authenticated.Screen name="ConsumerLanding" component={ConsumerLanding} options={{headerShown: false}} /> */}
    <Authenticated.Screen name="ConsumerLanding" component={ConsumerHomeBottomTab} options={{headerShown: false}} />
    <Authenticated.Screen name="ToktokDelivery" component={ToktokDelivery} />
    <Authenticated.Screen name="StopDetails" component={StopDetails} />
    <Authenticated.Screen name="DeliveryDetails" component={DeliveryDetails} />
    <Authenticated.Screen name="DeliverySummary" component={DeliverySummary} />

    <Authenticated.Screen name="PostRegistration" component={PostRegistration} />

    <Authenticated.Screen
      name="CheckConsumerLocation"
      component={CheckConsumerLocation}
      options={{headerShown: false, animationEnabled: false}}
    />
    <Authenticated.Screen
      name="ConsumerMap"
      component={ConsumerMap}
      options={{headerShown: false, animationEnabled: false}}
    />
    <Authenticated.Screen name="SearchPlaces" component={SearchPlaces} />
    <Authenticated.Screen name="SearchMap" component={SearchMap} />
    <Authenticated.Screen name="SenderDetails" component={SenderDetails} />
    <Authenticated.Screen name="RecipientDetails" component={RecipientDetails} />
    {/* <Authenticated.Screen name="DeliveryDetails" component={DeliveryDetails} /> */}
    {/* <Authenticated.Screen name="StopDetails" component={StopDetails} /> */}
    <Authenticated.Screen name="SearchContact" component={SearchContact} />

    <Authenticated.Screen name="Announcements" component={Announcements} />
    <Authenticated.Screen name="SelectedAnnouncement" component={SelectedAnnouncement} />
    <Authenticated.Screen name="DeliveryRating" component={DeliveryRating} />

    <Authenticated.Screen name="GCashAccount" component={GCashAccount} />

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

    <Authenticated.Screen name="TokTokWallet" component={Wallet} />
    <Authenticated.Screen name="TokTokWalletRestricted" component={WalletRestrictedScreen} />
    <Authenticated.Screen name="TokTokWalletSecurityAndPrivacy" component={WalletSecurityAndPrivacy} />
    <Authenticated.Screen name="TokTokWalletCashIn" component={PaymentOptions} />
    <Authenticated.Screen name="TokTokWalletCashInPaypanda" component={PayPanda} />
    <Authenticated.Screen name="TokTokWalletCashINPaypandaWebView" component={PayPandaWebView} />
    <Authenticated.Screen name="TokTokWalletSettings" component={WalletSettings} />
    <Authenticated.Screen name="TokTokWalletCashInLogs" component={CashInLogs} />
    <Authenticated.Screen name="TokTokWalletSettingsPinCode" component={WalletSettingsPinCode} />
    <Authenticated.Screen
      name="TokTokWalletPinCodeSecurity"
      component={WalletPinCodeSecurity}
      options={{
        headerShown: false,
      }}
    />
    <Authenticated.Screen name="TokToKWalletForgotPin" component={WalletForgotPincode} />
    <Authenticated.Screen name="TokTokWalletRecoverPin" component={WalletRecoverPincode} />
    <Authenticated.Screen name="TokTokWalletRecoverUpdatePin" component={WalletRecoverUpdatePincode} />
    <Authenticated.Screen name="TokTokWalletVerifyUser" component={WalletVerifyUser} />
    <Authenticated.Screen name="TokTokWalletVerifyUserSetup" component={WalletVerifyUserSetup} />
    <Authenticated.Screen name="TokTokWalletValidIDCamera" component={WalletValidIDCamera} />
    <Authenticated.Screen name="TokTokWalletSelfieCamera" component={WalletSelfieCamera} />
    <Authenticated.Screen name="TokTokWalletSelfieImageCamera" component={WalletSelfieImageCamera} />
    <Authenticated.Screen name="TokTokWalletActionsRequest" component={WalletActionsRequest} />

    <Authenticated.Screen name="TokTokWalletSendMoney" component={WalletSendMoney} />
    <Authenticated.Screen name="TokTokWalletContacts" component={WalletContacts} />

    <Authenticated.Screen name="TokTokWalletActionsScantoPay" component={WalletActionsScantoPay} />
    <Authenticated.Screen
      name="TokTokWalletActionsScantoPayConfirmPayment"
      component={WalletActionsScantoPayConfirmPayment}
    />
    <Authenticated.Screen name="TokTokWalletCashout" component={WalletCashout} />
    <Authenticated.Screen name="TokTokWalletCashoutLogs" component={CashOutLogs} />
    <Authenticated.Screen name="TokTokWalletGcashEncashment" component={WalletGcashEncashment} />

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
    <Authenticated.Screen name="ToktokWalletHistory" component={ToktokWalletHistory} />
    <Authenticated.Screen name="Order" component={Order} />
    <Authenticated.Screen name="SearchLocationFilter" component={SearchLocationFilter} />
    <Authenticated.Screen name="DriverDeliveriesTab" component={DriverDeliveriesTab} />
  </Authenticated.Navigator>
);

const mapStateToProps = (state) => ({
  session: state.session,
  constants: state.constants,
});

const mapDispatchToProps = (dispatch) => ({
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

const SwitchStack = () => {
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

export default Nav;
