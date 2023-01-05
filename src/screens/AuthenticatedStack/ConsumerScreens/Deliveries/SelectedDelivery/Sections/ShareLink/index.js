import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import constants from '../../../../../../../common/res/constants';
import {YellowIcon} from '../../../../../../../components/ui';
import {DARK, ORANGE} from '../../../../../../../res/constants';
import {FONT} from '../../../../../../../res/variables';
import Toast from 'react-native-simple-toast';

export const ShareLink = ({delivery}) => {
  const onPressCopyShareLink = () => {
    Clipboard.setString(delivery.shareLink);
    Toast.show('Copied to clipboard!');
  };

  return (
    <View style={[styles.cardShadow, {marginBottom: 16}]}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <YellowIcon set="Feather" name="link" size={14} darkIcon />

            <Text style={{marginLeft: 10, color: DARK, fontFamily: FONT.BOLD}}>
              Delivery <Text style={{color: ORANGE}}>Link</Text>
            </Text>
          </View>

          <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={onPressCopyShareLink}>
            <YellowIcon set="Feather" name="copy" size={14} darkIcon />
            <Text
              style={{
                marginLeft: 10,
                fontFamily: constants.FONT_FAMILY.REGULAR,
                color: constants.COLOR.ORANGE,
                fontSize: constants.FONT_SIZE.M,
              }}>
              Copy
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{marginTop: 12}}>
        <Text
          style={{
            fontFamily: constants.FONT_FAMILY.REGULAR,
            color: constants.COLOR.ALMOST_BLACK,
            fontSize: constants.FONT_SIZE.S,
          }}>
          Let others know the status of this delivery by sharing this link.
        </Text>
        <Text
          style={{
            fontFamily: constants.FONT_FAMILY.REGULAR,
            color: constants.COLOR.ORANGE,
            fontSize: constants.FONT_SIZE.S,
          }}>
          {delivery.shareLink}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
