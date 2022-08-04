import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {PepRequestVideoCall as PepRequestVideoCallComponent} from 'toktokwallet/components';
import {VerifyContext} from '../VerifyContextProvider';

export const PepRequestVideoCall = () => {
  const {pepInfo, setPepInfo, setCurrentIndex} = useContext(VerifyContext);

  return (
    <View style={styles.container}>
      <PepRequestVideoCallComponent pepInfo={pepInfo} setPepInfo={setPepInfo} setCurrentIndex={setCurrentIndex} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
