import React from 'react';
import {Text, View, ImageBackground, StyleSheet, Image} from 'react-native';
import BackgroundLanding from '../../../../assets/images/BackGroundLanding.png';
import CONSTANTS from '../../../../common/res/constants';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {ThrottledHighlight} from '../../../../components_section';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';

export const Landing = ({navigation}) => {
  return (
    <View>
      <ImageBackground source={BackgroundLanding} resizeMode={'cover'} style={{height: 112}}>
        <View style={{marginTop: 20, marginLeft: 20}}>
          <Text style={{color: CONSTANTS.COLOR.WHITE, fontSize: CONSTANTS.FONT_SIZE.XL}}>Hello ka-toktok!</Text>
          <Text style={{color: CONSTANTS.COLOR.WHITE, fontSize: CONSTANTS.FONT_SIZE.M}}>May pupuntahan ka ba?</Text>
        </View>
      </ImageBackground>
      <View style={styles.searchContainer}>
        <ThrottledHighlight
          underlayColor={CONSTANTS.COLOR.WHITE_UNDERLAY}
          onPress={() => {
            navigation.push('ToktokGoBookingSelectLocations', navigation);
          }}
          delay={100}
          style={styles.searchBox}>
          <View style={styles.inputBox}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FA5Icon name="map-marker-alt" size={20} color={CONSTANTS.COLOR.ORANGE} style={{marginLeft: 1}} />
              <View style={{flex: 1, marginLeft: 20}}>
                <Text style={{color: CONSTANTS.COLOR.DARK}}>Where to?</Text>
              </View>
            </View>
          </View>
        </ThrottledHighlight>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  searchContainer: {
    alignItems: 'center',
  },
  headerBox: {
    backgroundColor: 'white',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 5,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  greetingBox: {
    justifyContent: 'center',
    paddingHorizontal: CONSTANTS.SIZE.MARGIN,
  },
  searchBox: {
    bottom: 20,
    borderRadius: 5,
    backgroundColor: 'white',
    marginHorizontal: 16,
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
