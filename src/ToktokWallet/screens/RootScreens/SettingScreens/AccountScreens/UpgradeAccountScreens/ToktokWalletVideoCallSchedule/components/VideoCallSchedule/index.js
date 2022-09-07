import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {PepRequestVideoCall} from 'toktokwallet/components';
import {ContextChannelForm} from '../ContextProvider';

export const VideoCallSchedule = () => {
  const {pepInfo, setPepInfo, setCurrentIndex} = useContext(ContextChannelForm);

  return (
    <View style={styles.container}>
      <PepRequestVideoCall
        pepInfo={pepInfo}
        setPepInfo={setPepInfo}
        setCurrentIndex={setCurrentIndex}
        hasPreviousButton={false}
        btnLabel="Proceed"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
