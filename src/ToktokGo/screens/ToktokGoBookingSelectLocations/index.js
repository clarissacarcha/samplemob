import React from 'react';
import {Text, View, TouchableHighlight} from 'react-native';
import {Location, Header, FrequentlyUsed, SavedLocations} from './Sections';
import CONSTANTS from '../../../common/res/constants';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
const ToktokGoSelectedLocations = ({navigation}) => {
  return (
    <View style={{backgroundColor: CONSTANTS.COLOR.WHITE, flex: 1, justifyContent: 'space-between'}}>
      <View>
        <Header navigation={navigation} />
        <Location />
        <FrequentlyUsed />
        <View style={{borderBottomWidth: 6, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />
        <SavedLocations />
      </View>
      <TouchableHighlight onPress={() => console.log('trigger')}>
        <View
          style={{
            paddingHorizontal: CONSTANTS.SIZE.MARGIN,
            width: '100%',
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 16,
            borderTopColor: '#ECECEC',
            borderTopWidth: 2,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FA5Icon name="map-marker-alt" size={15} color={CONSTANTS.COLOR.ORANGE} style={{marginRight: 10}} />
            <Text style={{color: '#F6841F', fontFamily: CONSTANTS.FONT_FAMILY.BOLD, fontSize: CONSTANTS.FONT_SIZE.M}}>
              Select via Map
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};

export default ToktokGoSelectedLocations;
