import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import Spinner from 'react-native-spinkit';


export const LoadingOverlay = ({isVisible}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View style={styles.transparent}>
        <View
          style={{
            height: 160,
            width: 160,
            borderRadius: 10,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Spinner 
              isVisible={isVisible}
              type='Circle'
              color={"#F6841F"}
              size={40}
            />
          {/* <ActivityIndicator size={20} color="#560E8E" /> */}
          <View style={{marginTop: 20}}>
            <Text
              style={
                {
                  // fontFamily:
                  //   Platform.OS === 'ios' ? fontRegularIOS : fontRegular,
                }
              }>
              Loading
            </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});
