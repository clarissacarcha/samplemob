import {useNavigation} from '@react-navigation/native';
import React, {useContext} from 'react';
import {Text, View, TextInput} from 'react-native';
import {useSelector} from 'react-redux';

import styles from '../styles';
import YellowButton from 'toktokfood/components/YellowButton';
import {VerifyContext} from './VerifyContextProvider';
import CONSTANTS from 'common/res/constants';
const {COLOR} = CONSTANTS;

import {verticalScale} from 'toktokfood/helper/scale';

const RiderNotes = ({onNotesChange, notes = '', onPlaceOrder, showPlaceOrder = false, forDelivery = true}) => {
  const navigation = useNavigation();
  const {toktokWallet, temporaryCart, paymentMethod} = useContext(VerifyContext);
  const {customerWallet} = useSelector(state => state.toktokFood);
  const isDisabled = paymentMethod === 'TOKTOKWALLET' ? temporaryCart?.totalAmount > toktokWallet?.balance : false;

  // const onPlaceOrderNavigate = () => {
  //   navigation.replace('ToktokFoodDriver');
  // };

  return (
    <>
      <View style={styles.sectionContainer}>
        {forDelivery && (
          <>
            <View style={[styles.deliverWrapper, {paddingVertical: verticalScale(10)}]}>
              <Text style={styles.sectionTitle}>Note to Rider</Text>
            </View>
            <View>
              <TextInput
                multiline={true}
                numberOfLines={4}
                style={styles.input}
                placeholder="Type your instructions here..."
                value={notes}
                placeholderTextColor={COLOR.MEDIUM}
                onChangeText={v => onNotesChange(v)}
              />
            </View>
          </>
        )}

        <View style={{paddingVertical: 10}}>
          <YellowButton
            onPress={() => {
              onPlaceOrder();
            }}
            label="Place Order"
            disabled={
              isDisabled ||
              (temporaryCart.totalAmount > 2000 && customerWallet?.status === 2) ||
              !customerWallet ||
              customerWallet?.status === 0
            }
          />
        </View>
      </View>
    </>
  );
};

export default RiderNotes;
