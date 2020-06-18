import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Modal} from 'react-native';
import {connect} from 'react-redux';
import {RNCamera} from 'react-native-camera';
import {HeaderBack, HeaderTitle} from '../../../components';
// import Toast from 'react-native-simple-toast';
// import {CLIENT, POST_DOCUMENT_BATCH} from '../../../graphql';

const ItemCamera = ({navigation, route, session, startLoading, finishLoading}) => {
  const {label, setTempImage, onStatusUpdateWithImage} = route.params;

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={label} />,
  });

  let cameraRef = useRef(null);
  const [getShowCamera, setShowCamera] = useState(false);
  const [getLoading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowCamera(true);
    }, 250);
  }, []);

  const handleSelectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size,
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const takePicture = async () => {
    try {
      if (cameraRef) {
        const options = {
          quality: 0.5,
          // base64: true,
          width: 1024,
          fixOrientation: true,
        };
        const data = await cameraRef.current.takePictureAsync(options);
        console.log(data.uri);
        onStatusUpdateWithImage(data.uri);
        navigation.pop();

        // const result = await CLIENT.mutate({
        //   mutation: POST_DOCUMENT_BATCH,
        //   variables: {
        //     userId: session.user.id,
        //     verificationDocumentId: verification.id,
        //     document: [oneImage],
        //   },
        // });
        // console.log(result.data.postDocumentBatch);
        // Toast.show('Verification sent for approval.');
        // finishLoading();
        // navigation.pop();
      }
    } catch (error) {
      finishLoading();
      alert(error);
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
          // type={showFrontCam ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
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
          <TouchableOpacity onPress={() => takePicture()} style={styles.capture}>
            <View style={styles.inCapture} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  ) : (
    <View style={styles.container} />
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

export default connect(
  mapStateToProps,
  null,
)(ItemCamera);

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
