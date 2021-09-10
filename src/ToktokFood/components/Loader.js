import React from 'react';
import {View, ActivityIndicator, Modal, StyleSheet} from 'react-native';
import {COLOR} from 'res/variables';

const Loader = ({visibility = false}) => {
  return (
    <Modal visible={visibility} style={styles.container} transparent={true}>
      <View style={styles.content}>
        <ActivityIndicator color={COLOR.YELLOW} size="large"/>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(34, 34, 34, 0.6)',
  },
});
