import React, {useState} from 'react';
import {Image, View, Text} from 'react-native';

import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {markerIcon} from 'toktokfood/assets/images';
import {verticalScale} from 'toktokfood/helper/scale';
import DialogMessage from 'toktokfood/components/DialogMessage';

import styles from '../styles';

const ReceiverLocation = () => {
  const navigation = useNavigation();

  const {location} = useSelector((state) => state.toktokFood);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const onSetLocationDetails = () => {
    navigation.navigate('ToktokFoodAddressDetails', { isCart: true });
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
        <View style={[styles.deliverWrapper, {paddingVertical: verticalScale(2)}]}>
          <Text style={styles.sectionTitle}>Deliver To</Text>
          <View onTouchEnd={() => setShowConfirmation(true)}>
            <Text style={styles.actionText}>Change Address</Text>
          </View>
        </View>
        <View style={styles.textAddressContainer}>
          <Image style={styles.addressMarkerIcon} source={markerIcon} />
          <Text style={styles.textAddress} numberOfLines={2}>
            {location ? location.address : ''}
          </Text>
        </View>
      </View>
    </>
  );
};

export default ReceiverLocation;
