import React from 'react';
import {View, Text, Modal, StyleSheet, ActivityIndicator} from 'react-native';
import {COLOR, DARK} from '../res/constants';

export const AlertOverlay = ({visible}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.transparent}>
        <View style={styles.labelRow}>
          <View style={styles.labelBox}>
            <Text style={{color: DARK}}>Processing...</Text>
          </View>
          <View style={styles.loaderBox}>
            <ActivityIndicator color={COLOR} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  transparent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 20,
  },
  labelRow: {
    marginTop: 150,
    marginBottom: 20,
    height: 40,
    flexDirection: 'row',
  },
  labelBox: {
    flex: 1,
    backgroundColor: COLOR,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
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
