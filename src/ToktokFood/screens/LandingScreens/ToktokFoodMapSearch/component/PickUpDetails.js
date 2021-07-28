import React, {useRef} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import TextTicker from 'react-native-text-ticker';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';

import {verticalScale} from 'toktokfood/helper/scale';
import {FONT, FONT_SIZE, COLOR, SIZE} from 'res/variables';

import {useNavigation} from '@react-navigation/native';

const PickUpDetails = (props) => {
  const {pinAddress} = props;

  const navigation = useNavigation();

  return (
    <>
      <BottomSheet
        index={1}
        ref={useRef()}
        snapPoints={[0, 300]}
        enableHandlePanningGesture={false}
        enableContentPanningGesture={false}
        backdropComponent={() => <></>}
        handleComponent={() => <View style={styles.cartBorder}></View>}>
        <View style={styles.sheet}>
          <Text style={styles.pickUpAddressTitle}>Pickup Address Details</Text>
          <TextTicker loop duration={8000} repeatSpacer={25} marqueeDelay={1000} style={styles.pickUpAddress}>
            {pinAddress + '.'}
          </TextTicker>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              //   onChangeText={(value) => changePersonInfo('firstName', value)}
              placeholder="Your Complete Address"
            />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              //   onChangeText={(value) => changePersonInfo('firstName', value)}
              placeholder="Contact Person"
            />
          </View>
          <View style={[styles.inputWrapper, {marginBottom: 8}]}>
            <TextInput
              style={styles.input}
              //   onChangeText={(value) => changePersonInfo('firstName', value)}
              placeholder="Contact Person's Number"
            />
          </View>

          <TouchableOpacity onPress={() => navigation.popToTop()} style={styles.cartButton}>
            <Text style={styles.buttonText}>Confirm Address Details</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
    ...StyleSheet.absoluteFillObject,
  },
  cartBorder: {
    height: 20,
    borderTopWidth: 3,
    borderEndWidth: 2,
    borderStartWidth: 2,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    borderColor: COLOR.ORANGE,
    marginHorizontal: -2,
  },
  sheet: {
    paddingHorizontal: 16,
  },
  pickUpAddressTitle: {
    fontSize: FONT_SIZE.XL,
    fontFamily: FONT.BOLD,
    marginBottom: verticalScale(7),
  },
  pickUpAddress: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.REGULAR,
  },
  cartButton: {
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: SIZE.BUTTON_HEIGHT,
    backgroundColor: COLOR.YELLOW,
    width: '100%',
    marginTop: verticalScale(7),
  },
  buttonText: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  inputWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: COLOR.MEDIUM,
  },
  input: {
    height: 50,
    marginTop: 5,
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
  },
});
export default PickUpDetails;
