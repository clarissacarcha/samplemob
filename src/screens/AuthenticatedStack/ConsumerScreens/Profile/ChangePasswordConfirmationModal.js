// import React, { useState } from 'react'
// import { Text, StyleSheet, Image, View, Modal, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native'
// import constants from '../../../../common/res/constants'
// import Warning from '../../../../common/assets/globalert/Warning.png';
// export const ChangePasswordConfirmationModal = ({navigation, showConfirmationChangePassword, setConfirmationChangePassword, patchUserChangePassword}) => {

//     const [confirmed, setConfirmed] = useState(false);

//     return (
//        <Modal
//         animationType="fade"
//         transparent={true}
//         visible={showConfirmationChangePassword}
//         style={StyleSheet.absoluteFill}>
//             <View style={styles.transparent}>
//                 <View style={styles.card}>
//                     <View style={{justifyContent: 'center', alignItems: 'center'}}>
//                         <Image
//                             source={Warning}
//                             style={{height:125,width:150}}
//                             resizeMode={'contain'}
//                         />
//                         <Text style={{
//                             marginVertical:20,
//                             fontFamily: constants.FONT_FAMILY.BOLD,
//                             fontSize: constants.FONT_SIZE.XL + 3,
//                             color: constants.COLOR.YELLOW
//                         }} >Change Password</Text>
//                         <Text style={{
//                             fontFamily: constants.FONT_FAMILY.REGULAR,
//                             fontSize: constants.FONT_SIZE.M,
//                             color: '#000000'
//                         }} >Are you sure you want to</Text>
//                         <Text style={{
//                             marginBottom: 20,
//                             fontFamily: constants.FONT_FAMILY.REGULAR,
//                             fontSize: constants.FONT_SIZE.M,
//                             color: '#000000'
//                         }} > change your password?</Text>
//                     </View>
//                     <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
//                     <TouchableOpacity style={{
//                         backgroundColor: constants.COLOR.WHITE,
//                         borderRadius: 8,
//                         width: '43%',
//                         alignItems: 'center',
//                         paddingVertical: 10,
//                         borderWidth: 1,
//                         borderColor: constants.COLOR.ORANGE,
//                     }} onPress={() => {setConfirmationChangePassword(false)}}>
//                         <Text style={{
//                             fontFamily: constants.FONT_FAMILY.BOLD,
//                             fontSize: constants.FONT_SIZE.XL,
//                             color: constants.COLOR.ORANGE
//                         }}>No</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={{
//                         backgroundColor: constants.COLOR.ORANGE,
//                         borderRadius: 8,
//                         width: '43%',
//                         alignItems: 'center',
//                         paddingVertical: 10
//                     }} onPress={() => {
//                         setConfirmationChangePassword(false);
//                         patchUserChangePassword();
//                     }}>
//                         <Text style={{
//                             fontFamily: constants.FONT_FAMILY.BOLD,
//                             fontSize: constants.FONT_SIZE.XL,
//                             color: constants.COLOR.WHITE
//                         }}>Yes</Text>
//                     </TouchableOpacity>
//                 </View>
//                 </View>
//             </View>
//        </Modal>
//     )
// }

// const styles = StyleSheet.create({
//     transparent: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.6)',
//         padding: 30,
//         justifyContent: 'center'
//     },
//     card: {
//         backgroundColor: constants.COLOR.WHITE,
//         borderRadius: 10,
//         paddingHorizontal: 25,
//         paddingVertical: 30
//     }
// })
import React from 'react';
import {Text, StyleSheet, Image, View, Modal, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import Warning from '../../../../common/assets/globalert/Warning.png';

export const ChangePasswordConfirmationModal = ({
  navigation,
  showConfirmationChangePassword,
  setConfirmationChangePassword,
  patchUserChangePassword,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showConfirmationChangePassword}
      style={StyleSheet.absoluteFill}>
      <View style={styles.transparent}>
        <View style={styles.card}>
          <View style={styles.container}>
            <Image source={Warning} resizeMode={'contain'} style={styles.imageDimensions} />
            <Text style={styles.modalTitle}>Change Password</Text>
            <Text style={styles.modalDescription}>Are you sure you want to change your password?</Text>

            <View style={styles.retryContainer}>
              <TouchableOpacity
                style={styles.cancelButtonContainer}
                onPress={() => {
                  setConfirmationChangePassword(false);
                }}>
                <Text style={styles.textStyle}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.retryButtonContainer}
                underlayColor={CONSTANTS.COLOR.LIGHT}
                onPress={() => {
                  setConfirmationChangePassword(false), patchUserChangePassword();
                }}>
                <Text style={styles.cancelTextStyle}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  transparent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 30,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: CONSTANTS.COLOR.WHITE,
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 25,
  },
  modalTitle: {
    color: CONSTANTS.COLOR.YELLOW,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.XL + 3,
    marginVertical: 20,
  },
  modalSubTitle: {
    color: CONSTANTS.COLOR.ORANGE,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.M,
    marginBottom: 8,
  },
  modalDescription: {
    textAlign: 'center',
    fontSize: CONSTANTS.FONT_SIZE.M,
    color: CONSTANTS.COLOR.BLACK,
    marginHorizontal: 50,
  },
  imageDimensions: {
    width: 135,
    height: 120,
  },
  textHighlight: {
    color: CONSTANTS.COLOR.ORANGE,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
  },
  buttonText: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.XL,
    color: CONSTANTS.COLOR.WHITE,
  },
  retryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: CONSTANTS.COLOR.WHITE,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
    paddingVertical: 11,
    marginRight: 20,
  },
  textStyle: {
    textAlign: 'center',
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    color: CONSTANTS.COLOR.ORANGE,
  },
  retryButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
    paddingVertical: 11,
  },
  cancelTextStyle: {
    textAlign: 'center',
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    color: CONSTANTS.COLOR.WHITE,
  },
});
