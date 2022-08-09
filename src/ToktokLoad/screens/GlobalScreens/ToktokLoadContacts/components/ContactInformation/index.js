import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import CONSTANTS from 'common/res/constants';
import {useThrottle} from 'src/hooks';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const ContactInformation = ({item, index, setRecipient}) => {
  if (item?.contacts?.length === 0) return null;
  return (
    <>
      <View>
        <Text style={[styles.alphabet]}>{item?.letter}</Text>
        {item?.contacts.map(val => {
          return (
            <>
              <TouchableOpacity style={[styles.contactContainer]} onPress={() => setRecipient(val)}>
                <Text style={[styles.contactName]}>{val?.name}</Text>
                <Text style={[styles.contactNumber]}>{val?.number}</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
            </>
          );
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  contactContainer: {
    padding: 16,
  },
  alphabet: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.L,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  contactName: {
    color: '#525252',
    fontSize: FONT_SIZE.L,
    paddingTop: 5,
  },
  contactNumber: {
    color: '#525252',
    fontSize: FONT_SIZE.M,
    paddingTop: 5,
  },
  divider: {
    height: 2,
    width: '100%',
    backgroundColor: '#F8F8F8',
  },
});
