import React from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import InfoIcon from '../../../../assets/images/info.png';
import CONSTANTS from '../../../../common/res/constants';

export const InfoNote = () => {
  return (
    <View style={styles.container}>
      <Image source={InfoIcon} resizeMode={'center'} style={styles.imgDimensions} />
      <Text style={styles.textStyles}>
        Prices may vary depending on traffic condition. Subject to prevailing IATF guideline.
      </Text>
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
  },
  imgDimensions: {
    width: 13,
    height: 13,
    marginRight: 8,
    marginTop: 4,
  },
  textStyles: {
    color: CONSTANTS.COLOR.ORANGE,
  },
});
