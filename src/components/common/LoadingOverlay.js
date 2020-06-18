import React from 'react';
import {Overlay} from 'react-native-elements';
import {Text, View, StyleSheet} from 'react-native';
import {BarIndicator} from 'react-native-indicators';
import {COLOR} from '../../res/constants';

export const LoadingOverlay = props => {
  return (
    <Overlay
      windowBackgroundColor="rgba(0, 0, 0, .5)"
      overlayBackgroundColor="rgba(0, 0, 0, 0)"
      width="auto"
      height="auto"
      overlayStyle={{elevation: 0}}
      {...props}>
      <View style={styles.container}>
        <View style={styles.loaderContainer}>
          <BarIndicator color={COLOR} count={5} />
        </View>
        <Text style={styles.text}>Processing...</Text>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    height: 50,
  },
  text: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Roboto',
  },
});
