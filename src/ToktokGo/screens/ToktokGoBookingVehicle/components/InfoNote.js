import React from 'react';
import {Text, StyleSheet, View, Image, Platform} from 'react-native';
import InfoIcon from '../../../../assets/images/info.png';
import CONSTANTS from '../../../../common/res/constants';

export const InfoNote = () => {
  return (
    <View style={styles.container}>
      <Image source={InfoIcon} resizeMode={'contain'} style={styles.imgDimensions} />
      <View>
        <Text style={styles.textStyles}>Prices may vary depending on traffic condition. </Text>
        <Text style={styles.textStyles}>Subject to prevailing IATF guideline.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    padding: 16,
    alignItems: 'flex-start',
    flexDirection: 'row',
    backgroundColor: CONSTANTS.COLOR.LIGHT_YELLOW,
    marginTop: Platform.OS === 'ios' ? 10 : 0,
  },
  imgDimensions: {
    width: 13,
    height: 13,
    marginRight: 8,
    marginTop: 4,
  },
  textStyles: {
    marginRight: 16,
    color: CONSTANTS.COLOR.ORANGE,
  },
});
