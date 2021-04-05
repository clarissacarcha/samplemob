import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import {connect} from 'react-redux';
import {HeaderBack, HeaderTitle} from '../../../../../components';
import {COLOR, LIGHT, ORANGE} from '../../../../../res/constants';

import {WhiteButton, BlackButton} from '../../../../../revamp';

//SELF IMPORTS
import {PaymentForm, PaymentSheet} from './PaymentForm';
import ExpressForm from './ExpressForm';
import {ItemForm, ItemSheet} from './ItemForm';
import NotesForm from './NotesForm';
import PabiliForm from './PabiliForm';
import PromoForm from './PromoForm';

const OrderSummary = ({navigation, session}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Delivery', 'Details']} />,
  });

  const [notes, setNotes] = useState('');

  const paymentSheetRef = useRef();
  const itemSheetRef = useRef();

  return (
    <View style={styles.screenBox}>
      <View style={{height: 10}} />
      <PaymentForm bottomSheetRef={paymentSheetRef} />
      <ItemForm bottomSheetRef={itemSheetRef} />

      <NotesForm value={notes} onChange={setNotes} />

      <PromoForm />

      <ExpressForm onChange={() => {}} />
      <PabiliForm onChange={() => {}} />

      <View style={{flex: 1}} />
      <BlackButton label="Next" onPress={() => {}} />
      <View style={{height: 10}} />
      <PaymentSheet ref={paymentSheetRef} />
      <ItemSheet ref={itemSheetRef} />
    </View>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(OrderSummary);

const styles = StyleSheet.create({
  screenBox: {
    paddingHorizontal: 10,
    backgroundColor: 'white',
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 10,
    // alignItems: 'center',
    // backgroundColor: 'blue',
  },
});
