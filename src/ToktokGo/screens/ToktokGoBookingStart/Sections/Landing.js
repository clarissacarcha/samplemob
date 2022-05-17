import React from 'react';
import {Text, View, ImageBackground, StyleSheet, Image} from 'react-native';
import BackgroundLanding from '../../../../assets/images/BackGroundLanding.png';
import CONSTANTS from '../../../../common/res/constants';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {ThrottledHighlight} from '../../../../components_section';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import DestinationIcon from '../../../../assets/icons/DestinationIcon.png';
import uuid from 'react-native-uuid';
import {useDispatch} from 'react-redux';

export const Landing = ({navigation}) => {
  const dispatch = useDispatch();
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
            dispatch({type: 'SET_TOKTOKGO_BOOKING_SESSION_TOKEN', payload: uuid.v4()});
            dispatch({type: 'SET_TOKTOKGO_BOOKING_INITIAL_STATE'});
            navigation.push('ToktokGoBookingSelectLocations', {
              popTo: 1,
            });
          }}
          delay={500}
          style={styles.searchBox}>
          <View style={styles.inputBox}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1, marginLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={DestinationIcon}
                  style={{height: 20, width: 20, marginRight: 5}}
                  resizeMode={'contain'}
                />
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
