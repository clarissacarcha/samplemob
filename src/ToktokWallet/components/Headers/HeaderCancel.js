import React, {useState} from 'react';
import {TouchableHighlight, View, StyleSheet, Text} from 'react-native';
import {CancelModalPrompt} from 'toktokwallet/components';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const HeaderCancel = ({navigation, screenPopNo = 1, onPressCancelYes}) => {
  const [leaveModalvisible, setLeaveModalVisible] = useState(false);

  const cancelSetup = () => {
    setLeaveModalVisible(true);
  };

  return (
    <>
      <CancelModalPrompt
        visible={leaveModalvisible}
        setVisible={setLeaveModalVisible}
        onPressYes={onPressCancelYes ? onPressCancelYes : () => navigation.pop(screenPopNo)}
      />
      <TouchableHighlight style={{paddingRight: 16}} underlayColor={'white'} onPress={cancelSetup}>
        <View style={styles.container}>
          <Text style={styles.cancel}>Cancel</Text>
        </View>
      </TouchableHighlight>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancel: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
    color: '#929191',
  },
});
