import React, {useState} from 'react';
import { TouchableHighlight, View, StyleSheet, Text } from 'react-native';
import { LeavePromptModal } from 'toktokwallet/components';

import CONSTANTS from 'common/res/constants';
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS;

export const HeaderCancel = ({ navigation, screenPopNo = 1 })=> {

  const [leaveModalvisible, setLeaveModalVisible] = useState(false);

  const cancelSetup = ()=> {
    setLeaveModalVisible(true)
  } 
  
  return (
    <>
      <LeavePromptModal
        visible={leaveModalvisible}
        setVisible={setLeaveModalVisible}
        onConfirm={()=>navigation.pop(screenPopNo)}
      />
       <TouchableHighlight style={{paddingRight: 16}} underlayColor={'white'} onPress={cancelSetup}>
        <View style={styles.container}>
          <Text style={styles.cancel}>Cancel</Text>
        </View>
      </TouchableHighlight>
    </>
   
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent:"center",
    alignItems:"center"
  },
  cancel: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
    color: '#929191'
  },
})