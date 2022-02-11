import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {COLOR, FONT_SIZE, FONT, SIZE} from '../res/variables';

const aButtons = [
  {
    message: 'Something happened.',
    buttonLabel: 'Okie Doks',
    onPress: () => {},
  },
];

const SingleButton = ({close, buttonLabel, actionButtons = []}, pop, navigation) => {
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
        marginTop: 40,
        width: 100,
        backgroundColor: COLOR.YELLOW,
        borderRadius: SIZE.BORDER_RADIUS,
      }}>
      <Text style={{fontFamily: FONT.BOLD}}>{label}</Text>
    </TouchableOpacity>
  );
};

export const AlertModal = props => {
  const {visible, close, buttonLabel, message, actionButtons = [], title, pop = 0, navigation} = props;

  const RenderButton = () => {
    return <SingleButton {...props} />;
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.transparent}>
      <View style={styles.labelBox}>
        <Image
          style={{height: 80, width: 80, marginBottom: 10}}
          source={require('../assets/toktokwallet-assets/error.png')}
        />
        {title && (
          <Text style={{marginVertical: 10, fontFamily: FONT.BOLD, fontSize: FONT_SIZE.XL, textAlign: 'center'}}>
            {title}
          </Text>
        )}
        <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.L, textAlign: 'center'}}>{message}</Text>
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
    paddingHorizontal: 50,
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
    padding: 20,
  },
  divider: {
    height: 20,
  },
  loaderBox: {
    marginLeft: 20,
    width: 40,
    height: 40,
    backgroundColor: COLOR.DARK,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
