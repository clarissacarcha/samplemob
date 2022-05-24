import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import CONSTANTS from '../../../../common/res/constants';

export const AccordionBooking = ({titleText, titleAmount, subTexts = [], dummyStatus, navigation}) => {
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
          navigation.push('ToktokGoPaymentDetails');
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
              fontSize: CONSTANTS.FONT_SIZE.M,
              color: CONSTANTS.COLOR.ORANGE,
            }}>
            {titleText}
          </Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'flex-end'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
                fontSize: CONSTANTS.FONT_SIZE.M,
                color: CONSTANTS.COLOR.ORANGE,
              }}>
              Show Details{' '}
            </Text>
            <MIcons
              name={'keyboard-arrow-right'}
              style={{
                fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
                fontSize: CONSTANTS.FONT_SIZE.XL + 3,
                color: CONSTANTS.COLOR.ORANGE,
              }}
            />
          </View>

          <Text
            style={{
              fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
              fontSize: CONSTANTS.FONT_SIZE.M,
              color: CONSTANTS.COLOR.ORANGE,
            }}>
            {titleAmount}
          </Text>
          {/* {
                        (dummyStatus > 1) &&
                        <MIcons name={!open ? "keyboard-arrow-down" : "keyboard-arrow-up"} style={{ fontFamily: CONSTANTS.FONT_FAMILY.BOLD, fontSize: CONSTANTS.FONT_SIZE.XL + 8,color:CONSTANTS.COLOR.ORANGE ,paddingTop:4}} />
                    } */}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    alignItems: 'center',
  },
});
