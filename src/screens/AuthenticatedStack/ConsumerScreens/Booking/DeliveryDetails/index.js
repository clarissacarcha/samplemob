import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  View,
  TextInput,
} from 'react-native';
import {
  BookingOverlay,
  LocationPermission,
  WelcomeBanner,
  WelcomeMessage,
  HeaderBack,
  HeaderTitle,
} from '../../../../../components';
import InputScrollView from 'react-native-input-scroll-view';
import {COLOR, DARK, LIGHT, MAPS_API_KEY, MEDIUM, COLOR_UNDERLAY} from '../../../../../res/constants';
import {GET_ORDER_PRICE, GET_WELCOME_MESSAGE, POST_DELIVERY} from '../../../../../graphql';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import MapBoxPolyline from '@mapbox/polyline';
import {PERMISSIONS, RESULTS, check} from 'react-native-permissions';
import {useMutation, useQuery} from '@apollo/react-hooks';

import EIcon from 'react-native-vector-icons/Entypo';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FIcon from 'react-native-vector-icons/Feather';
import MapViewDirections from 'react-native-maps-directions';
import OneSignal from 'react-native-onesignal';
import ToktokLogo from '../../../../../assets/icons/ToktokLogo.png';
import {SizedBox} from '../../../../../components/widgets/SizedBox';

import {connect} from 'react-redux';
import {currentLocation, numberFormatInteger} from '../../../../../helper';
import {onError} from '../../../../../util/ErrorUtility';

import {
  CollectPaymentFromInput,
  CashOnDeliveryInput,
  ItemDescriptionInput,
  BlackButton,
} from '../../../../../components/forms';

//SELF IMPORTS
import StopCard from './StopCard';

const width = Dimensions.get('window').width;
const itemDimension = (width - 120) / 5;

const SearchMap = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Delivery', 'Details']} />,
  });

  const {bookingData} = route.params;

  console.log(JSON.stringify(bookingData, null, 4));

  const scrollRef = useRef(null);
  const [isCashOnDelivery, setIsCashOnDelivery] = useState(false);

  const scrollToEnd = () => {
    setTimeout(() => {
      scrollRef.current.scrollToEnd();
    }, 50);
  };

  return (
    <View style={styles.container}>
      <InputScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        keyboardOffset={20}
        contentContainerStyle={styles.scrollView}>
        <StopCard
          onPress={() => alert('Holla')}
          label={['Sender', 'Details']}
          headerIconSet="FontAwesome5"
          headerIconName="map-pin"
        />

        <SizedBox />

        <StopCard
          onPress={() => alert('Holla')}
          label={['Recipient', 'Details']}
          headerIconSet="FontAwesome5"
          headerIconName="map-marker-alt"
        />

        <SizedBox />

        <CollectPaymentFromInput initialValue={'S'} onSelect={() => alert('ola')} isCashOnDelivery={isCashOnDelivery} />

        <SizedBox />

        <CashOnDeliveryInput onSwitchChange={(value) => setIsCashOnDelivery(value)} />

        <SizedBox />

        <ItemDescriptionInput onSelect={() => {}} initialData={'Document'} scrollToEnd={scrollToEnd} />

        <SizedBox />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          value={''}
          onChangeText={() => {}}
          style={styles.input}
          placeholder="Notes to rider"
          placeholderTextColor={LIGHT}
          keyboardType="default"
        />

        <SizedBox />

        <Text style={styles.label}>Promo Code</Text>
        <TextInput
          value={''}
          onChangeText={() => {}}
          style={styles.input}
          placeholder="Enter Promo Code"
          placeholderTextColor={LIGHT}
          keyboardType="default"
        />

        <SizedBox />

        <BlackButton onPress={() => {}} label="Confirm" containerStyle={{marginTop: 0}} />
      </InputScrollView>
    </View>
  );
};

export default SearchMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 20,
  },
  map: {
    flex: 1,
  },
  addressBox: {
    height: 60,
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: COLOR,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 10,
    paddingLeft: 20,
    height: 50,
    color: DARK,
    backgroundColor: 'white',
  },
  submitBox: {
    margin: 20,
    borderRadius: 10,
  },
  submit: {
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingPin: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxDark: {
    backgroundColor: DARK,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontFamily: 'Rubik-Medium',
  },
  itemType: {
    height: itemDimension,
    width: itemDimension,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: MEDIUM,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
