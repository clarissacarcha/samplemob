import React from 'react';
import {Text, StyleSheet, View, Dimensions, Image} from 'react-native';
import FindingDriver from '../../../../assets/images/finding-driverfinal.gif';
import NoFound from '../../../../assets/images/NoDriverFound.png';
import CONSTANTS from '../../../../common/res/constants';

const ImageDimension = (Dimensions.get('window').width - 130) / 2;

export const FindingDriverStatus = ({waitingStatus, renderStatus, waitingText, textValue}) => {
  return (
    <View style={styles.container}>
      <Image
        source={waitingStatus ? FindingDriver : NoFound}
        resizeMode={'contain'}
        style={{width: ImageDimension, height: ImageDimension}}
      />
      {/*---todo: assign text based on status---*/}
      <Text style={styles.titleStyle}>{waitingStatus ? 'Finding Driver' : textValue.title}</Text>
      <Text style={{textAlign: 'center'}}>{waitingStatus ? renderStatus(waitingText) : textValue.body}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
    flex: 0.7,
    marginHorizontal: 15,
  },
  titleStyle: {
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.XL,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    marginTop: 24,
  },
});
