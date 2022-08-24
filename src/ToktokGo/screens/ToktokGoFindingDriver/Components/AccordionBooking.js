import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import ArrowUp from '../../../../assets/icons/arrow-up-icon.png';
import ArrowDown from '../../../../assets/icons/arrow-down-icon.png';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import CONSTANTS from '../../../../common/res/constants';

// UNUSED COMPONENT
export const AccordionBooking = ({titleText, titleAmount, subTexts = [], dummyStatus}) => {
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
          dummyStatus > 1 && setOpen(!open);
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
              fontSize: CONSTANTS.FONT_SIZE.L,
              color: CONSTANTS.COLOR.ORANGE,
            }}>
            {titleText}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
              fontSize: CONSTANTS.FONT_SIZE.L,
              color: CONSTANTS.COLOR.ORANGE,
            }}>
            {titleAmount}
          </Text>
          {dummyStatus > 1 && (
            <Image
              source={!open ? ArrowDown : ArrowUp}
              resizeMode={'contain'}
              style={{marginLeft: 8, marginTop: 2, width: 12, height: 22}}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
