import React from 'react';
import {Text} from 'react-native';
import {connect} from 'react-redux';
import {COLOR, FONT_SIZE, SIZE} from '../res/variables';
import {APP_FLAVOR} from '../res/constants';
import {DeliveriesTopTabHeader} from '../components';
import EIcon from 'react-native-vector-icons/Entypo';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
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
import Pabili from '../screens/AuthenticatedStack/ConsumerScreens/PabiliScreens/Pabili';
import PabiliSearchAddress from '../screens/AuthenticatedStack/ConsumerScreens/PabiliScreens/PabiliSearchAddress';
import PabiliDetails from '../screens/AuthenticatedStack/ConsumerScreens/PabiliScreens/PabiliDetails';
import NearbyStores from '../screens/AuthenticatedStack/ConsumerScreens/PabiliScreens/NearbyStores';
import PartnerBranches from '../screens/AuthenticatedStack/ConsumerScreens/PabiliScreens/PartnerBranches';
import SelectedAdvertisement from '../screens/AuthenticatedStack/ConsumerScreens/AdvertisementScreens/SelectedAdvertisement';
import ConsumerMenu from '../screens/AuthenticatedStack/ConsumerScreens/ConsumerMenu';
import ConsumerNotifications from '../screens/AuthenticatedStack/ConsumerScreens/ConsumerNotifications';

/*---------- CONSUMER TOKTOK WALLET SCREENS ----------*/
import ToktokWalletHomePage from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/ToktokWalletHomePage';
import ToktokWalletRestricted from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/ToktokWalletRestricted';
import ToktokWalletSecurityAndPrivacy from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/ToktokWalletSecurityAndPrivacy';
import ToktokWalletSecurityPinCode from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/ToktokWalletSecurityPinCode';
import ToktokWalletPaymentOptions from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/CashInScreens/ToktokWalletPaymentOptions';
import ToktokWalletPayPandaForm from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/CashInScreens/ToktokWalletPayPandaForm';
import ToktokWalletPayPandaWebView from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/CashInScreens/ToktoKWalletPayPandaWebView';
import ToktokWalletCashOut from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/CashOutScreens/ToktokWalletCashOut';
import ToktokWalletGcashCashOut from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/CashOutScreens/ToktokWalletGcashCashOut';
import ToktokWalletSendMoney from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/SendMoneyScreens/ToktokWalletSendMoney';
import ToktokWalletContacts from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/SendMoneyScreens/ToktokWalletContacts';
import ToktokWalletScanQR from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/ScanQRScreens/ToktokWalletScanQR';
import ToktokWalletScanQRConfirm from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/ScanQRScreens/ToktokWalletScanQRConfirm';
import ToktokWalletSettings from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/SettingScreens/ToktokWalletSettings';
import ToktokWalletCashInLogs from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/SettingScreens/ToktokWalletCashInLogs';
import ToktokWalletCashOutLogs from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/SettingScreens/ToktokWalletCashOutLogs';
import ToktokWalletCreatePin from '../screens//AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/SettingScreens/PinCodeScreens/ToktokWalletCreatePin';
import ToktokWalletRecoveryMethods from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/SettingScreens/PinCodeScreens/ToktokWalletRecoveryMethods';
import ToktokWalletRecoverPin from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/SettingScreens/PinCodeScreens/ToktokWalletRecoverPin';
import ToktokWalletUpdatePin from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/SettingScreens/PinCodeScreens/ToktokWalletUpdatePin';
import ToktokWalletVerifySetup from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/SettingScreens/VerificationScreens/ToktokWalletVerifySetup';
import ToktokWalletVerification from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/SettingScreens/VerificationScreens/ToktokWalletVerification';
import ToktokWalletValidIDCamera from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/SettingScreens/VerificationScreens/ToktokWalletValidIDCamera';
import ToktokWalletSelfieCamera from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/SettingScreens/VerificationScreens/ToktokWalletSelfieCamera';
import ToktokWalletSelfieImageCamera from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/SettingScreens/VerificationScreens/ToktokWalletSelfieImageCamera';
import ToktokWalletVerifyResult from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/SettingScreens/VerificationScreens/ToktokWalletVerifyResult';

import ToktokWalletTransactions from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens//ToktokWalletTransactions';
import ToktokWalletRecentTransferView from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/ToktokWalletRecentTransferView';
import ToktokWalletReviewAndConfirm from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/ToktokWalletReviewAndConfirm';
import ToktokWalletGcashRegistration from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/CashOutScreens/ToktokWalletGcashRegistration';
import ToktokWalletGcashUpdate from '../screens/AuthenticatedStack/ConsumerScreens//ToktokWalletScreens/CashOutScreens/ToktokWalletGcashUpdate';
import ToktokWalletGcashHomePage from '../screens/AuthenticatedStack/ConsumerScreens/ToktokWalletScreens/CashOutScreens/ToktokWalletGcashHomePage';

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

const ConsumerBottomTabStack = createStackNavigator();

const DriverDeliveriesTab = () => {
  return (
    <>
      <DeliveriesTopTabHeader />
      <DriverDeliveries.Navigator
        swipeEnabled={false}
        upperCaseLabel={false}
        tabBarOptions={{
          activeTintColor: COLOR.YELLOW,
          inactiveTintColor: COLOR.DARK,
          allowFontScaling: false,
          indicatorStyle: {backgroundColor: COLOR.YELLOW},

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
              const iconColor = focused ? COLOR.YELLOW : COLOR.DARK;
              return <EIcon name="time-slot" color={iconColor} size={20} />;
            },
          })}
        />
        <DriverDeliveries.Screen
          name="Pending"
          component={Pending}
          options={() => ({
            tabBarLabel: ({focused}) => {
              const iconColor = focused ? COLOR.YELLOW : COLOR.DARK;
              return <FAIcon name="refresh" color={iconColor} size={20} />;
            },
          })}
        />
        <DriverDeliveries.Screen
          name="Completed"
          component={Completed}
          options={() => ({
            tabBarLabel: ({focused}) => {
              const iconColor = focused ? COLOR.YELLOW : COLOR.DARK;
              return <FA5Icon name="check" color={iconColor} size={20} />;
            },
          })}
        />
        <DriverDeliveries.Screen
          name="Cancelled"
          component={Cancelled}
          options={() => ({
            tabBarLabel: ({focused}) => {
              const iconColor = focused ? COLOR.YELLOW : COLOR.DARK;
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
  <DriverHome.Navigator
    tabBarOptions={{activeTintColor: COLOR.YELLOW, inactiveTintColor: COLOR.DARK, showLabel: false}}>
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
  <ConsumerHome.Navigator
    tabBarOptions={{
      activeTintColor: COLOR.YELLOW,
      inactiveTintColor: COLOR.MEDIUM,
      // showLabel: false,
      // style: {marginBottom: -10},
      labelStyle: {
        fontSize: 9,
      },
    }}>
    <ConsumerHome.Screen
      name="ConsumerLanding"
      component={ConsumerLanding}
      options={{
        tabBarLabel: ({focused}) => (
          <Text style={{fontSize: 10, color: focused ? COLOR.BLACK : COLOR.MEDIUM}}>Home</Text>
        ),
        tabBarIcon: ({color}) => <MCIcon name="home" color={color} size={30} />,
      }}
    />
    <ConsumerHome.Screen
      name="CustomerDeliveries"
      component={CustomerDeliveries}
      // options={{
      //   headerLeft: () => <HeaderBack />,
      //   headerTitle: () => <HeaderTitle label={['My', 'Deliveries']} />,
      // }}
      options={{
        tabBarLabel: ({focused}) => (
          <Text style={{fontSize: 10, color: focused ? COLOR.BLACK : COLOR.MEDIUM}}>Deliveries</Text>
        ),
        tabBarIcon: ({color}) => <FA5Icon name="clipboard-list" color={color} size={26} />,
      }}
    />
    <ConsumerHome.Screen
      name="ConsumerNotifications"
      component={ConsumerNotifications}
      options={{
        tabBarLabel: ({focused}) => (
          <Text style={{fontSize: 10, color: focused ? COLOR.BLACK : COLOR.MEDIUM}}>Notifications</Text>
        ),
        tabBarIcon: ({color}) => <MIcon name="notifications" color={color} size={26} />,
      }}
    />
    <ConsumerHome.Screen
      name="ConsumerMenu"
      component={ConsumerMenu}
      options={{
        tabBarLabel: ({focused}) => (
          <Text style={{fontSize: 10, color: focused ? COLOR.BLACK : COLOR.MEDIUM}}>Menu</Text>
        ),
        tabBarIcon: ({color}) => <EIcon name="menu" color={color} size={30} />,
        // tabBarButton: (props) => <TouchableWithoutFeedback {...props} onPress={() => navigation.openDrawer()} />,
      }}
    />
  </ConsumerHome.Navigator>
);

const ConsumerLandingStack = () => (
  <ConsumerBottomTabStack.Navigator>
    <ConsumerBottomTabStack.Screen
      name="ConsumerBottomTabScreen"
      component={ConsumerHomeBottomTab}
      options={{
        headerShown: false,
      }}
    />
  </ConsumerBottomTabStack.Navigator>
);

const AuthenticatedStack = () => (
  <Authenticated.Navigator>
    {/* <Authenticated.Screen name="ConsumerLanding" component={ConsumerLanding} options={{headerShown: false}} /> */}
    <Authenticated.Screen name="ConsumerLanding" component={ConsumerHomeBottomTab} options={{headerShown: false}} />
    <Authenticated.Screen name="ToktokDelivery" component={ToktokDelivery} options={{headerShown: false}} />
    <Authenticated.Screen name="StopDetails" component={StopDetails} options={{headerShown: false}} />
    <Authenticated.Screen name="DeliveryDetails" component={DeliveryDetails} />
    <Authenticated.Screen name="DeliverySummary" component={DeliverySummary} />
    <Authenticated.Screen name="Pabili" component={Pabili} options={{headerShown: false}} />
    <Authenticated.Screen name="PabiliSearchAddress" component={PabiliSearchAddress} options={{headerShown: false}} />
    <Authenticated.Screen name="PabiliDetails" component={PabiliDetails} />
    <Authenticated.Screen name="NearbyStores" component={NearbyStores} />
    <Authenticated.Screen name="PartnerBranches" component={PartnerBranches} />
    <Authenticated.Screen name="SelectedAdvertisement" component={SelectedAdvertisement} />
    <Authenticated.Screen name="ConsumerMenu" component={ConsumerMenu} />

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

    {/* <Authenticated.Screen name="CustomerDeliveries" component={CustomerDeliveries} /> */}
    <Authenticated.Screen name="SelectedDeliveries" component={SelectedDeliveries} />
    <Authenticated.Screen name="SelectedDelivery" component={SelectedDelivery} />
    <Authenticated.Screen name="DeliveryTracking" component={DeliveryTracking} />

    <Authenticated.Screen name="SavedLocations" component={SavedLocations} />
    <Authenticated.Screen name="AddLocation" component={AddLocation} />

    {/*----------toktokwallet Screens----------*/}
    <Authenticated.Screen name="ToktokWalletHomePage" component={ToktokWalletHomePage} />
    <Authenticated.Screen name="ToktokWalletRestricted" component={ToktokWalletRestricted} />
    <Authenticated.Screen name="ToktokWalletSecurityAndPrivacy" component={ToktokWalletSecurityAndPrivacy} />
    <Authenticated.Screen
      name="ToktokWalletSecurityPinCode"
      component={ToktokWalletSecurityPinCode}
      options={{
        headerShown: false,
      }}
    />
    <Authenticated.Screen name="ToktokWalletPaymentOptions" component={ToktokWalletPaymentOptions} />
    <Authenticated.Screen name="ToktokWalletPayPandaForm" component={ToktokWalletPayPandaForm} />
    <Authenticated.Screen name="ToktokWalletPayPandaWebView" component={ToktokWalletPayPandaWebView} />
    <Authenticated.Screen name="ToktokWalletCashOut" component={ToktokWalletCashOut} />
    <Authenticated.Screen name="ToktokWalletGcashCashOut" component={ToktokWalletGcashCashOut} />
    <Authenticated.Screen name="ToktokWalletSendMoney" component={ToktokWalletSendMoney} />
    <Authenticated.Screen name="ToktokWalletContacts" component={ToktokWalletContacts} />
    <Authenticated.Screen name="ToktokWalletScanQR" component={ToktokWalletScanQR} />
    <Authenticated.Screen name="ToktokWalletScanQRConfirm" component={ToktokWalletScanQRConfirm} />
    <Authenticated.Screen name="ToktokWalletSettings" component={ToktokWalletSettings} />
    <Authenticated.Screen name="ToktokWalletCashInLogs" component={ToktokWalletCashInLogs} />
    <Authenticated.Screen name="ToktokWalletCashOutLogs" component={ToktokWalletCashOutLogs} />
    <Authenticated.Screen name="ToktokWalletCreatePin" component={ToktokWalletCreatePin} />
    <Authenticated.Screen name="ToktokWalletRecoveryMethods" component={ToktokWalletRecoveryMethods} />
    <Authenticated.Screen name="ToktokWalletRecoverPin" component={ToktokWalletRecoverPin} />
    <Authenticated.Screen name="ToktokWalletUpdatePin" component={ToktokWalletUpdatePin} />
    <Authenticated.Screen name="ToktokWalletVerifySetup" component={ToktokWalletVerifySetup} />
    <Authenticated.Screen name="ToktokWalletVerification" component={ToktokWalletVerification} />
    <Authenticated.Screen name="ToktokWalletValidIDCamera" component={ToktokWalletValidIDCamera} />
    <Authenticated.Screen name="ToktokWalletSelfieCamera" component={ToktokWalletSelfieCamera} />
    <Authenticated.Screen name="ToktokWalletSelfieImageCamera" component={ToktokWalletSelfieImageCamera} />
    <Authenticated.Screen name="ToktokWalletVerifyResult" component={ToktokWalletVerifyResult} options={{headerShown: false}}  />
    
    <Authenticated.Screen name="ToktokWalletTransactions" component={ToktokWalletTransactions} />
    <Authenticated.Screen name="ToktokWalletRecentTransferView" component={ToktokWalletRecentTransferView} />
    <Authenticated.Screen name="ToktokWalletReviewAndConfirm" component={ToktokWalletReviewAndConfirm}/>
    <Authenticated.Screen name="ToktokWalletGcashRegistration" component={ToktokWalletGcashRegistration}/>
    <Authenticated.Screen name="ToktokWalletGcashUpdate" component={ToktokWalletGcashUpdate}/>
    <Authenticated.Screen name="ToktokWalletGcashHomePage" component={ToktokWalletGcashHomePage}/>

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
    screenOptions={{gestureEnabled: false}}
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
