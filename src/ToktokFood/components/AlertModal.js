import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet , Image} from 'react-native';
// import {BlackButton} from './forms/BlackButton';
import {COLOR, FONT_SIZE, FONT, SIZE} from 'src/res/variables';

const messageError = (error) => {
  try {
    const {graphQLErrors, networkError} = error;

    if (networkError) {
      return 'Network error occurred. Please check your internet connection.';
    } else if (graphQLErrors.length > 0) {
      graphQLErrors.map(({message, locations, path, code}) => {
        if (code === 'INTERNAL_SERVER_ERROR') {
          return 'Something went wrong.'
        } else if (code === 'USER_INPUT_ERROR') {
          return message
        } else if (code === 'BAD_USER_INPUT') {
          return message
        } else if (code === 'AUTHENTICATION_ERROR') {
          // Do Nothing. Error handling should be done on the screen
        } else {
          return 'Something went wrong...'
        }
      });
    }
  } catch (err) {
    console.log('ON ERROR ALERT: ', err);
  }
};


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
        marginTop: 40,
        width: 100,
        backgroundColor: COLOR.YELLOW,
        borderRadius: SIZE.BORDER_RADIUS
      }}>
      <Text style={{fontFamily: FONT.BOLD}}>{label}</Text>
    </TouchableOpacity>
  );
};

export default AlertModal = (props) => {
  const {visible, close, buttonLabel, error} = props;

  const RenderButton = () => {
    return <SingleButton {...props} />;
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.transparent}>
      <View style={styles.labelBox}>
        <Image style={{height: 80,width: 80,marginBottom: 10,}} source={require('src/assets/toktokwallet-assets/error.png')}/>
        <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.L,textAlign:"center"}}>{messageError(error)}</Text>
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
    padding:20,
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
