import React from 'react';
import {Text, StyleSheet, View, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import constants from '../../../../common/res/constants';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import {ThrottledOpacity} from '../../../../components_section';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
const screenWidth = Dimensions.get('window').width;
export const NotesToDriver = ({dropDownRef, navigation, popTo, note, setNote, notesToDriver, notes, loading}) => {
  const {origin} = useSelector(state => state.toktokGo);
  const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

  return (
    <View>
      <ShimmerPlaceHolder
        style={[{width: screenWidth / 1.08, marginBottom: !loading ? 0 : 18}, loading ? {height: 30} : {}]}
        visible={!loading}>
        <ThrottledOpacity
          delay={500}
          onPress={() => {
            navigation.pop();
            navigation.push('ToktokGoBookingSelectLocations', {
              popTo: popTo + 1,
              selectInput: 'P',
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
            <Text style={{paddingRight: 20}}>{origin?.place?.formattedAddress}</Text>
          </View>
        </ThrottledOpacity>
      </ShimmerPlaceHolder>
      <Text
        style={{
          color: '#525252',
          fontSize: constants.FONT_SIZE.M,
          fontFamily: constants.FONT_FAMILY.SEMI_BOLD,
          paddingVertical: 10,
        }}>
        Notes to Driver
      </Text>
      <View style={styles.containerTextInput}>
        <TextInput
          ref={dropDownRef}
          defaultValue={notes.text}
          placeholder="e.g. I have two luggage"
          keyboardType="default"
          onChangeText={value => notesToDriver(value)}
          style={styles.Input}
          numberOfLines={5}
          maxLength={320}
          multiline
        />
        {/* <View style={{alignItems: 'flex-end'}}>
          <Text style={styles.textInputLength}>{notes.textLength}/320</Text>
        </View> */}
      </View>
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
  containerTextInput: {
    backgroundColor: '#F8F8F8',
    borderColor: 'red',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#F8F8F8',
  },
  textInputLength: {
    marginRight: 15,
    marginBottom: 10,
    color: '#9E9E9E',
    fontFamily: constants.FONT_FAMILY.REGULAR,
    fontSize: constants.FONT_SIZE.S,
  },
});
