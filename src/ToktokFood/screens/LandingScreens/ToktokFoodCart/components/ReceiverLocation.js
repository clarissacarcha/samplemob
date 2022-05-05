import React, {useState} from 'react';
import {Image, View, Text, StyleSheet} from 'react-native';

import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {cart_map_pin_icon, locationOutline, phoneBlack, user} from 'toktokfood/assets/images';
import {verticalScale} from 'toktokfood/helper/scale';
import DialogMessage from 'toktokfood/components/DialogMessage';

import {getMobileNumberFormat} from '../../ToktokFoodCart/functions';

import styles from '../styles';

const ReceiverLocation = ({cart}) => {
  const navigation = useNavigation();

  const {location, receiver} = useSelector(state => state.toktokFood);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const DELIVERY_RECEIVER =
    receiver.contactPerson && receiver.contactPerson !== ''
      ? receiver.contactPerson
      : `${customerInfo.firstName} ${customerInfo.lastName}`;

  const shopName = cart?.items.length ? cart.items[0].shopName : '';
  const shopAddress = cart?.items.length ? cart.items[0].shopAddress : '';

  const onSetLocationDetails = () => {
    navigation.navigate('ToktokFoodAddressDetails', {isCart: true});
  };

  return (
    <>
      <DialogMessage
        visibility={showConfirmation}
        title="Change Location"
        messages="You will lose the items in your cart if you change location. Proceed?"
        type="warning"
        btn1Title="Cancel"
        btn2Title="Proceed"
        onCloseBtn1={() => {
          setShowConfirmation(false);
        }}
        onCloseBtn2={() => {
          setShowConfirmation(false);
          onSetLocationDetails();
        }}
        hasTwoButtons
      />
      <View style={styles.sectionContainer}>
        <View style={styles.shopDetailsContainer}>
          <Image source={cart_map_pin_icon} resizeMode="contain" style={styles.mapPin} />

          <View style={styles.shopDetails}>
            <Text style={styles.sectionTitle}>{shopName}</Text>
            <Text style={styles.subtitle} numberOfLines={2}>
            {shopAddress}
          </Text>
          </View>
        </View>
        <View style={[styles.deliverWrapper, {paddingVertical: verticalScale(2)}]}>
          <Text style={styles.sectionTitle}>Deliver To</Text>
          <View onTouchEnd={() => setShowConfirmation(true)}>
            <Text style={styles.actionText}>Change</Text>
          </View>
        </View>
        <View style={compStyle.textAddressContainer}>
          <Image style={styles.addressMarkerIcon} source={locationOutline} />
          <Text style={styles.textAddress} numberOfLines={2}>
            {location ? location.address : ''}
          </Text>
        </View>
        {receiver.landmark !== '' && (
          <Text style={[styles.textAddress, {marginLeft: 20, color: '#525252'}]} numberOfLines={2}>
            Landmark: {receiver.landmark}
          </Text>
        )}

        <View style={[compStyle.textAddressContainer, {marginTop: 7}]}>
          <Image style={styles.addressMarkerIcon} source={user} />
          <Text style={styles.textAddress} numberOfLines={2}>
            {DELIVERY_RECEIVER.replace(/[^a-z0-9_ ]/gi, '')}
          </Text>
        </View>

        <View style={compStyle.textAddressContainer}>
          <Image style={styles.addressMarkerIcon} source={phoneBlack} />
          <Text style={styles.textAddress} numberOfLines={2}>
            {receiver.contactPersonNumber && receiver.contactPersonNumber !== ''
              ? getMobileNumberFormat({conno: receiver.contactPersonNumber})
              : getMobileNumberFormat(customerInfo)}
          </Text>
        </View>
      </View>
    </>
  );
};

const compStyle = StyleSheet.create({
  textAddressContainer: {
    maxWidth: '90%',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: verticalScale(5),
  },
});

export default ReceiverLocation;
