import {useNavigation} from '@react-navigation/native';
import React, {useContext} from 'react';
import {Text, View, TextInput} from 'react-native';
import styles from '../styles';
import YellowButton from 'toktokfood/components/YellowButton';
import {VerifyContext} from './VerifyContextProvider';
import CONSTANTS from 'common/res/constants';
const {FONT_FAMILY: FONT, FONT_SIZE, COLOR} = CONSTANTS;

import {verticalScale} from 'toktokfood/helper/scale';

const RiderNotes = ({onNotesChange, notes = '', onPlaceOrder, showPlaceOrder = false, forDelivery = true}) => {
  const navigation = useNavigation();
  const {toktokWallet, temporaryCart, paymentMethod} = useContext(VerifyContext);
  const isDisabled = paymentMethod == 'TOKTOKWALLET' ? temporaryCart?.totalAmount > toktokWallet?.balance : false;

  const onPlaceOrderNavigate = () => {
    navigation.replace('ToktokFoodDriver');
  };

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
                onChangeText={(v) => onNotesChange(v)}
              />
            </View>
          </>
        )}

        {isDisabled && (
          <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S, textAlign: 'center', color: '#FF322A'}}>
            Insufficient balance
          </Text>
        )}
        <View style={{paddingVertical: 10}}>
          <YellowButton
            onPress={() => {
              onPlaceOrder();
            }}
            label="Place Order"
            disabled={showPlaceOrder || isDisabled}
          />
        </View>
      </View>
    </>
  );
};

export default RiderNotes;
