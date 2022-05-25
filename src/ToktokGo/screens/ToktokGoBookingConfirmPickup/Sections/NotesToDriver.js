import React from 'react';
import {Text, StyleSheet, View, TextInput, TouchableOpacity} from 'react-native';
import constants from '../../../../common/res/constants';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import {ThrottledOpacity} from '../../../../components_section';

export const NotesToDriver = ({dropDownRef, navigation, popTo, note, setNote}) => {
  const {origin} = useSelector(state => state.toktokGo);

  return (
    <View>
      <ThrottledOpacity
        delay={500}
        onPress={() => {
          navigation.pop();
          navigation.push('ToktokGoBookingSelectLocations', {
            popTo: popTo + 1,
          });
        }}
        style={{
          backgroundColor: '#F8F8F8',
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderRadius: 5,
        }}>
        <View style={{flexDirection: 'row', textAlign: 'center', marginHorizontal: 5}}>
          <FA5Icon name="map-pin" size={18} color={constants.COLOR.YELLOW} style={{marginRight: 10}} />
          <Text>{origin.place.formattedAddress}</Text>
        </View>
      </ThrottledOpacity>
      <Text
        style={{
          color: '#525252',
          fontSize: constants.FONT_SIZE.M,
          fontFamily: constants.FONT_FAMILY.BOLD,
          paddingVertical: 10,
        }}>
        Notes to Driver
      </Text>
      <TextInput
        ref={dropDownRef}
        value={note}
        placeholder="e.g. I have two luggage"
        keyboardType="default"
        onChangeText={value => setNote(value)}
        style={styles.Input}
        numberOfLines={5}
        multiline
      />
    </View>
  );
};
const styles = StyleSheet.create({
  Input: {
    height: 69,
    textAlignVertical: 'top',
    borderColor: '#F8F8F8',
    borderWidth: 1,
    fontSize: 11,
    padding: 8,
    backgroundColor: '#F8F8F8',
    borderRadius: 5,
    width: '100%',
  },
});
