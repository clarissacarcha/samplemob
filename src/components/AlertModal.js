import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
// import {BlackButton} from './forms/BlackButton';
import {BlackButton} from '../revamp';
import {DARK, FONT_MEDIUM, FONT_REGULAR} from '../res/constants';
import {COLOR, FONT_SIZE, FONT} from '../res/variables';

const aButtons = [
  {
    message: 'Something happened.',
    buttonLabel: 'Okie Doks',
    onPress: () => {},
  },
];

const SingleButton = ({close, buttonLabel, actionButtons = []}) => {
  let label = 'OK';

  if (buttonLabel) {
    label = buttonLabel;
  }

  if (actionButtons.length > 0) {
    label = actionButtons[0].buttonLabel;
  }

  return (
    <TouchableOpacity
      onPress={close}
      style={{
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32,
        width: 100,
      }}>
      <Text style={{fontFamily: FONT.BOLD, color: COLOR.ORANGE}}>{label}</Text>
    </TouchableOpacity>
  );
};

export const AlertModal = (props) => {
  const {visible, close, buttonLabel, message, actionButtons = []} = props;

  const RenderButton = () => {
    return <SingleButton {...props} />;
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.transparent}>
      <View style={styles.labelBox}>
        <Text style={{color: DARK, fontFamily: FONT_MEDIUM}}>{message}</Text>
        {RenderButton()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  transparent: {
    // flex: 1,
    zIndex: 999999,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 75,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  labelBox: {
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 8,
  },
  divider: {
    height: 20,
  },
  loaderBox: {
    marginLeft: 20,
    width: 40,
    height: 40,
    backgroundColor: DARK,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
