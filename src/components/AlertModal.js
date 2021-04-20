import React from 'react';
import {View, Text, Modal, StyleSheet} from 'react-native';
// import {BlackButton} from './forms/BlackButton';
import {BlackButton} from '../revamp';
import {COLOR, DARK, FONT_MEDIUM, FONT_REGULAR} from '../res/constants';

const aButtons = [
  {
    message: 'Something happened.',
    buttonLabel: 'Okie Doks',
    onPress: () => console.log('BUTTON IS PRESSED...'),
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

  return <BlackButton label={label} onPress={close} />;
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
        <Text style={{color: DARK,fontFamily: FONT_MEDIUM}}>{message}</Text>
      </View>
      <View style={styles.divider} />
      {RenderButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  transparent: {
    // flex: 1,
    zIndex: 999999,
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 20,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  labelBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 40,
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
