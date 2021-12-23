import React from 'react';
import {COLORS, FONTS, SIZES} from 'res/constants';
import {Modal, StyleSheet, View, StatusBar, Text, TouchableOpacity} from 'react-native';

const MODAL_TYPE = {
  INFORMATION: 1,
  CONFIRMATION: 2,
};

const PromptMessage = (props) => {
  const {visible, setVisible, type, message, onConfirm} = props;
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={visible ? 'rgba(34, 34, 34, 0.5)' : 'transparent'} />
      <Modal visible={visible} style={styles.container} transparent={true}>
        <View style={styles.content}>
          <View style={styles.closePrompt}>
            <View style={{flex: 1, paddingTop: 5}}>
              <Text
                style={{
                  fontSize: SIZES.L,
                  fontFamily: FONTS.BOLD,
                  textAlign: type === MODAL_TYPE.INFORMATION ? 'center' : 'left',
                }}>
                {message}
              </Text>
            </View>
            <View style={styles.actions}>
              {type === MODAL_TYPE.CONFIRMATION && (
                <TouchableOpacity
                  onPress={() => setVisible(false)}
                  style={{
                    borderRadius: 5,
                    marginRight: 10,
                    height: '100%',
                    backgroundColor: '#F7F7FA',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontFamily: FONTS.BOLD, fontSize: SIZES.L, color: 'gray'}}>No</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                  type === MODAL_TYPE.CONFIRMATION && onConfirm();
                }}
                style={{
                  borderRadius: 5,
                  marginLeft: 10,
                  height: '100%',
                  backgroundColor: COLORS.YELLOW,
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontFamily: FONTS.BOLD, fontSize: SIZES.L, color: COLORS.DARK}}>
                  {type === MODAL_TYPE.INFORMATION ? 'OK' : 'Yes'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default PromptMessage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(34, 34, 34, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closePrompt: {
    height: 190,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
  },
  actions: {
    flexDirection: 'row',
    height: 50,
  },
});
