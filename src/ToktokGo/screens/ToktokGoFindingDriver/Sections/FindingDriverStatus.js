import React from 'react';
import {Text, StyleSheet, View, Dimensions, Image} from 'react-native';
import FindingDriver from '../../../../assets/images/finding-driverfinal.gif';
import NoFound from '../../../../assets/images/NoDriverFound.png';
import CONSTANTS from '../../../../common/res/constants';

const ImageDimension = (Dimensions.get('window').width - 130) / 2;

export const FindingDriverStatus = ({waitingStatus, renderStatus, waitingText}) => {
  return (
    <View style={styles.container}>
      <Image
        source={waitingStatus ? FindingDriver : NoFound}
        resizeMode={'contain'}
        style={{width: ImageDimension, height: ImageDimension}}
      />
      {/*---todo: assign text based on status---*/}
      <Text style={styles.titleStyle}>{waitingStatus ? 'Finding Driver' : 'No Driver Found'}</Text>
      <Text style={{textAlign: 'center'}}>{renderStatus(waitingText)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
    flex: 0.7,
  },
  titleStyle: {
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.XL,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    marginTop: 24,
  },
});
