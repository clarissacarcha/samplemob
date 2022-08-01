import React, {useState} from 'react';
import {Image, View, Text, StyleSheet} from 'react-native';

import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {locationOutline, phoneBlack, user} from 'toktokfood/assets/images';
import {verticalScale} from 'toktokfood/helper/scale';
import DialogMessage from 'toktokfood/components/DialogMessage';

import {getMobileNumberFormat} from '../../ToktokFoodCart/functions';

import styles from '../styles';

const ReceiverLocation = () => {
  const navigation = useNavigation();

  const {location, receiver} = useSelector(state => state.toktokFood);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const DELIVERY_RECEIVER =
    receiver.contactPerson && receiver.contactPerson !== ''
      ? receiver.contactPerson
      : `${customerInfo.firstName} ${customerInfo.lastName}`;

  const onSetLocationDetails = () => {
    navigation.navigate('ToktokFoodAddressDetails', {isCart: true});
  };

  const removeSpecialCharacters = text => text.replace(/[^a-z0-9 ]/gi, '');

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
        <View style={[styles.deliverWrapper, {paddingVertical: verticalScale(2)}]}>
          <Text style={styles.sectionTitle}>Deliver To</Text>
          <View onTouchEnd={() => setShowConfirmation(true)}>
            <Text style={styles.actionText}>Change Address</Text>
          </View>
        </View>
        <View style={compStyle.textAddressContainer}>
          <Image style={styles.addressMarkerIcon} source={locationOutline} />
          <Text style={styles.textAddress} numberOfLines={2}>
            {location ? removeSpecialCharacters(location.address) : ''}
          </Text>
        </View>
        {receiver.landmark !== '' && (
          <Text style={[styles.textAddress, {marginLeft: 20, color: '#525252'}]} numberOfLines={2}>
            Landmark: {removeSpecialCharacters(receiver.landmark)}
          </Text>
        )}

        <View style={[compStyle.textAddressContainer, {marginTop: 7}]}>
          <Image style={styles.addressMarkerIcon} source={user} />
          <Text style={styles.textAddress} numberOfLines={2}>
            {removeSpecialCharacters(DELIVERY_RECEIVER)}
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
