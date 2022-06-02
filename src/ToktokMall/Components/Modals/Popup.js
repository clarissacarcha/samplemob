import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Modal,
  Image,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FONT, FONT_SIZE } from '../../../res/variables';
import { success2, loadingLottie } from '../../assets';
import Spinner from 'react-native-spinkit';
import LottieView from 'lottie-react-native';

export const PopupModal = ({isVisible, label = "Loading"}) => {

  const {popupmodal} = useSelector(state => state.toktokMall);

  if(popupmodal.type == "Loading"){
    return (
      <Modal animationType="fade" transparent={true} visible={popupmodal.visible}>
        <View style={styles.transparent}>
          <View
            style={{
              height: 180,
              width: 180,
              borderRadius: 12,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}>            
            <ActivityIndicator size={80} color="#F6841F" style={{borderRadius: 15}} />
            <View style={{marginTop: 20}}>
              <Text style={{color: "#F6841F", fontFamily: FONT.BOLD}} >
                {popupmodal.label}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }else if(popupmodal.type == "Success"){
    return (
      <Modal animationType="fade" transparent={true} visible={popupmodal.visible}>
        <View style={styles.transparent}>
          <View
            style={{
              height: 180,
              width: 180,
              borderRadius: 12,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}>            
            <Image source={success2} width={100} height={100} resizeMode="cover" />
            <View style={{marginTop: 20}}>
              <Text style={{color: "#F6841F", fontFamily: FONT.BOLD}} >
                {popupmodal.label}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

};

export const PopupModalComponent = ({isVisible, type, label = "Loading", useLottie}) => {

  if(type == "Loading"){
    return (
      <Modal animationType="fade" transparent={true} visible={isVisible}>
        <View style={styles.transparent}>
          <View
            style={{
              height: 180,
              width: 180,
              borderRadius: 12,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}>            
            {
              Platform.OS == "ios" ? 
                <LottieView
                  autoPlay={true}
                  source={loadingLottie}
                  style={{top: -10}}
                />
                :
                <ActivityIndicator size={80} color="#F6841F" style={{borderRadius: 15}} />
            }
            <View style={{marginTop: Platform.OS == "ios" ? 80 : 16}}>
              <Text style={{color: "#F6841F", fontFamily: FONT.BOLD}} >
                {label}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }else if(type == "Success"){
    return (
      <Modal animationType="fade" transparent={true} visible={isVisible}>
        <View style={styles.transparent}>
          <View
            style={{
              height: 180,
              width: 180,
              borderRadius: 12,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}>            
            <Image source={success2} width={100} height={100} resizeMode="cover" />
            <View style={{marginTop: 20}}>
              <Text style={{color: "#F6841F", fontFamily: FONT.BOLD}} >
                {label}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

};

const styles = StyleSheet.create({
  transparent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
