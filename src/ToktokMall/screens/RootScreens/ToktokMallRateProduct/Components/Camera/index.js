import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Modal, Alert} from 'react-native';
import {connect} from 'react-redux';
import {RNCamera} from 'react-native-camera';
import Toast from "react-native-simple-toast"

const Component = ({navigation, route}) => {
  const {setImage} = route.params;

  let cameraRef = useRef(null);
  const [getShowCamera, setShowCamera] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowCamera(true);
    }, 250);
  }, []);

  const takePicture = async () => {
    try {
      if (cameraRef) {
        const options = {
          quality: 0.5,
          width: 1024,
          fixOrientation: true,
        };
        const data = await cameraRef.current.takePictureAsync(options);

        setImage(data);
        navigation.pop();
      }
    } catch (error) {
      Toast.show('Something went wrong with taking a picture.');
    }
  };

  return getShowCamera ? (
    <>
      <Modal animationType="fade" transparent={true} visible={false}>
        <View style={styles.transparent} />
      </Modal>

      <View style={styles.container}>
        <RNCamera
          ref={cameraRef}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 0,
            width: '100%',
            marginBottom: 20,
          }}>
          <TouchableOpacity onPress={takePicture} style={styles.capture}>
            <View style={styles.inCapture} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  ) : (
    <View style={styles.container} />
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

export const ToktokMallRateProductCamera =  connect(mapStateToProps, null)(Component);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  transparent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inCapture: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
});
