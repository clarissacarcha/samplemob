import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import CONSTANTS from '../../../../common/res/constants';
import ArrowRightIcon from '../../../../assets/icons/arrow-right-icon.png';

export const AccordionBooking = ({titleText, titleAmount, subTexts = [], navigation, booking}) => {
  const [open, setOpen] = useState(false);
  return (
    <View>
      {open &&
        subTexts.map((val, ind) => {
          return (
            <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2}}>
              <Text style={{fontFamily: CONSTANTS.FONT_FAMILY.REGULAR, fontSize: CONSTANTS.FONT_SIZE.M}}>
                {val.text}
              </Text>
              <Text
                style={{
                  fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
                  fontSize: CONSTANTS.FONT_SIZE.M,
                  paddingHorizontal: 7,
                }}>
                {val.amount}
              </Text>
            </View>
          );
        })}

      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          navigation.push('ToktokGoPaymentDetails', {
            booking: booking,
          });
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
          <Text
            style={{
              fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
              fontSize: CONSTANTS.FONT_SIZE.M,
              color: CONSTANTS.COLOR.ORANGE,
              marginHorizontal: 5,
            }}>
            Show Details
          </Text>
          {/* <MIcons
            name={'keyboard-arrow-right'}
            style={{
              fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
              fontSize: CONSTANTS.FONT_SIZE.XL + 3,
              color: CONSTANTS.COLOR.ORANGE,
            }}
          /> */}
          <Image source={ArrowRightIcon} resizeMode={'contain'} style={{height: 8, width: 7, alignItems: 'center'}} />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
                fontSize: CONSTANTS.FONT_SIZE.XL,
                color: CONSTANTS.COLOR.ORANGE,
              }}>
              {titleText}
            </Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'flex-end'}}>
            <Text
              style={{
                fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
                fontSize: CONSTANTS.FONT_SIZE.XL,
                color: CONSTANTS.COLOR.ORANGE,
              }}>
              {titleAmount}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingVertical: 5,
  },
});
