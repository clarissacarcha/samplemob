import React, {useRef, useState, useEffect} from 'react';
import {Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform, ActivityIndicator} from 'react-native';
import {RNCamera} from 'react-native-camera';
import ImageCropper from 'react-native-simple-image-cropper';
import {CheckIdleState, PreviousNextButton} from 'toktokwallet/components';
import FIcon from 'react-native-vector-icons/FontAwesome5';
import CONSTANTS from 'common/res/constants';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

const {width, height} = Dimensions.get('window');

const CROP_AREA_WIDTH = width * 0.85;
const CROP_AREA_HEIGHT = CROP_AREA_WIDTH;

const MainComponent = ({checkTimeout, children}) => {
  if (checkTimeout) {
    return <CheckIdleState>{children}</CheckIdleState>;
  }

  return <>{children}</>;
};

export const ToktokWalletSelfieImageCamera = ({navigation, route}) => {
  navigation.setOptions({
    headerShown: false,
  });

  const cameraRef = useRef(null);
  const [canDetectFaces, setCanDetectFaces] = useState(null);
  const [box, setBox] = useState(null);
  const [check, setCheck] = useState(false);
  const [boundary, setBoundary] = useState({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  });
  const [message, setMessage] = useState({
    msg: "Position your face within the frame. Don't wear anything covering your face.",
    icon: 'bullseye',
  });
  const [boxColor, setBoxColor] = useState('white');
  const [checkSmile, setCheckSmile] = useState(false);
  const [checkNotSmiling, setCheckNotSmiling] = useState(false);
  const [leftEyeWink, setLeftEyeWink] = useState(false);
  const [leftEyeOpen, setLeftEyeOpen] = useState(false);
  const [rightEyeOpen, setRightEyeOpen] = useState(false);
  const [rightEyeWink, setRightEyeWink] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [cropperParams, setCropperParams] = useState({});
  const checkTimeout = route?.params?.checkTimeout ? true : false;
  const [picInterval, setPicInterval] = useState(null);

  const takePicture = async () => {
    setCheck(true);
    try {
      if (cameraRef) {
        const options = {
          quality: 1,
          // base64: true,
          width: 1024,
          fixOrientation: true,
        };
        
        // setTimeout(async () => {
        //   const data = await cameraRef.current.takePictureAsync(options);
        //   route.params.setImage(data);
        //   navigation.pop();
        // }, 1000);
        const data = await cameraRef.current.takePictureAsync(options);
        Platform.OS === 'ios' ? setTempImage(data) : setTempImage(data);
      }
    } catch (error) {
      console.log(error);
      //   Alert.alert('Something went wrong with taking a picture.');
    }
  };

  const confirmIosPicture = async () => {
    try {
      const croppedResult = await ImageCropper.crop({
        ...cropperParams,
        imageUri: tempImage.uri,
        cropAreaSize,
        cropSize,
      });
      route.params.setImage(
        {
          ...tempImage,
          uri: croppedResult,
        },
      ); //front or back
      navigation.pop();
    } catch (error) {
      console.log(error);
      Alert.alert('', 'Sorry, we cannot process this image. Please select another one.');
    }
  };

  const cropSize = {
    width: Platform.OS === 'ios' ? CROP_AREA_WIDTH : CROP_AREA_WIDTH,
    height: Platform.OS === 'ios' ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT,
  };

  const cropAreaSize = {
    width: Platform.OS === 'ios' ? CROP_AREA_WIDTH : CROP_AREA_WIDTH,
    height: Platform.OS === 'ios' ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT,
  };

  useEffect(() => {
    if ((leftEyeWink && leftEyeOpen) || (rightEyeWink && rightEyeOpen)) {
      setMessage({
        msg: `Don't move , Scanning Face`,
        icon: null,
      });
      takePicture();
    }
  }, [leftEyeWink, rightEyeWink]);

  const refreshStates = () => {
    setBoxColor('white');
    setCheckSmile(false);
    setCheckNotSmiling(false);
    setLeftEyeOpen(false);
    setLeftEyeWink(false);
    setRightEyeOpen(false);
    setRightEyeWink(false);
  };

  const onFacesDetected = async e => {
    const result = {
      // // x: e.faces[0].bounds.origin.x / 2,
      // x: e.faces[0].bounds.origin.x,
      x: Platform.OS === 'ios' ? e.faces[0].bounds.origin.x : e.faces[0].bounds.origin.x / 2,
      y: e.faces[0].bounds.origin.y,
      // // width: e.faces[0].bounds.size.width + ( e.faces[0].bounds.origin.x / 2),
      // width: e.faces[0].bounds.size.width,
      width:
        Platform.OS === 'ios'
          ? e.faces[0].bounds.size.width
          : e.faces[0].bounds.size.width + e.faces[0].bounds.origin.x / 2,
      height: e.faces[0].bounds.size.height,
      rotateX: e.faces[0].yawAngle,
      rotateY: e.faces[0].rollAngle,
    };

    setBox(result);

    if (message.icon) {
      if (checkifOutsideBox(boundary, result)) {
        console.log('Outside the box');
        setMessage({
          msg: "Position your face within the frame. Don't wear anything covering your face.",
          icon: 'bullseye',
        });
        refreshStates();
        return;
      }

      if (e.faces[0].bounds.size.height < CROP_AREA_HEIGHT - 120) {
        setMessage({
          msg: 'Bring your phone closer to you.',
          icon: 'mobile-alt',
        });
        refreshStates();
        return;
      }
    }

    if (!check) {
      setBoxColor(COLOR.YELLOW);
      console.log(JSON.stringify(e));

      if (e.faces[0].leftEyeOpenProbability > 0.6) {
        setLeftEyeOpen(true);
      }

      if (e.faces[0].rightEyeOpenProbability > 0.6) {
        setRightEyeOpen(true);
      }

      if (e.faces[0].smilingProbability < 0.6) {
        setCheckNotSmiling(true);
      }

      if (!checkSmile) {
        setMessage({
          msg: `Smile to auto capture photo`,
          icon: 'smile',
        });
        if (e.faces[0].smilingProbability > 0.8) {
          setCheckSmile(true);
        }
        return;
      }

      // if(!leftEyeWink){
      //     setMessage({
      //         msg: `Try to blink your left eye`,
      //         icon: "smile"
      //     })
      //     if(e.faces[0].leftEyeOpenProbability < 0.2){
      //         setLeftEyeWink(true)
      //     }
      //     return
      // }

      if (checkSmile && checkNotSmiling) {
        setMessage({
          msg: `Don't move , Scanning Face`,
          icon: null,
        });
        takePicture();
      }

      // if(checkSmile){
      //        if(!leftEyeWink || !rightEyeWink){
      //             setMessage({
      //                 msg: `BLINK your eye`,
      //                 icon: "smile"
      //             })
      //             if(e.faces[0].leftEyeOpenProbability < 0.2){
      //                 setLeftEyeWink(true)
      //             }
      //             if(e.faces[0].rightEyeOpenProbability < 0.2){
      //                 setRightEyeWink(true)
      //             }
      //             return
      //         }

      //     return
      // }
    }
  };

  const checkifOutsideBox = (boundary, result) => {
    return (
      result.x < boundary.x ||
      result.x + result.width > boundary.x + boundary.width ||
      result.y < boundary.y ||
      result.y + result.height > boundary.y + boundary.height ||
      result.height > boundary.height ||
      result.width > boundary.width
    );
  };

  if (tempImage) {
    return (
      <MainComponent checkTimeout={checkTimeout}>
        <View style={styles.header}>
          <Text style={{fontSize: FONT_SIZE.L + 1, textAlign: 'center'}}>Take a Selfie</Text>
        </View>
        <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
            <View style={styles.retakeCameraBox}>
              <View style={[styles.borderEdges, {borderTopWidth: 6, borderLeftWidth: 6, top: 0, left: 0}]} />
              <View style={[styles.borderEdges, {borderTopWidth: 6, borderRightWidth: 6, top: 0, right: 0}]} />
              <View style={[styles.borderEdges, {borderBottomWidth: 6, borderLeftWidth: 6, bottom: 0, left: 0}]} />
              <View style={[styles.borderEdges, {borderBottomWidth: 6, borderRightWidth: 6, bottom: 0, right: 0}]} />
              <ImageCropper
                imageUri={tempImage.uri}
                cropAreaWidth={CROP_AREA_WIDTH - 2}
                cropAreaHeight={CROP_AREA_HEIGHT - 2}
                containerColor="black"
                areaColor="black"
                setCropperParams={cropperParams => {
                  setCropperParams(cropperParams);
                }}
              />
            </View>
          </View>
          <PreviousNextButton
            label="Retake"
            labelTwo={'Confirm'}
            hasShadow
            onPressPrevious={() => {
              setTempImage(null);
            }}
            onPressNext={Platform.OS === 'ios' ? confirmIosPicture : confirmIosPicture}
          />
        </View>
      </MainComponent>
    );
  }

  return (
    <MainComponent checkTimeout={checkTimeout}>
      <View style={styles.camera}>
        <TouchableOpacity onPress={() => navigation.pop()} style={styles.backBtn}>
          <FIcon name="chevron-left" size={16} color={COLOR.ORANGE} />
        </TouchableOpacity>

        <RNCamera
          ref={cameraRef}
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          flashMode={RNCamera.Constants.FlashMode.off}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
          // faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
          faceDetectionClassifications={RNCamera.Constants.FaceDetection.Classifications.all}
          onFacesDetected={canDetectFaces ? onFacesDetected : null}
          onFaceDetectionError={err => {
            console.log(err);
          }}
          onCameraReady={() => {
            setTimeout(() => {
              setCanDetectFaces(true);
            }, 2000);
          }}>
          <View style={styles.preview}>
            {box && (
              <View
                style={{
                  // borderRadius: box.width,
                  justifyContent: 'flex-end',
                  position: 'absolute',
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: boxColor,
                  zIndex: 9999,
                  width: box.width,
                  height: box.height,
                  transform: [
                    {
                      translateX: box.x,
                    },
                    {
                      translateY: box.y,
                    },
                    {
                      rotateX: `${box.rotateX}deg`,
                    },
                  ],
                }}></View>
            )}
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent',
                marginBottom: 50,
              }}>
              <View
                style={styles.cameraBox}
                onLayout={event => {
                  const layout = event.nativeEvent.layout;
                  setBoundary(layout);
                }}>
                <View
                  style={{
                    paddingVertical: 10,
                    position: 'absolute',
                    top: -70,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.XL, color: 'white', textAlign: 'center'}}>
                    Take a selfie
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: -130,
                  }}>
                  <View
                    style={{
                      padding: 10,
                      backgroundColor: 'rgba(158, 158, 158, 0.77)',
                      borderRadius: 5,
                    }}>
                    <Text style={{color: 'white', textAlign: 'center'}}>{message.msg}</Text>
                    {message.icon == null ? <ActivityIndicator style={{marginTop: 5}} color={'white'} /> : null}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </RNCamera>

        {/* <View style={styles.instructions}>
              <Text style={{fontFamily: FONT.BOLD,FONTize: FONT_SIZE.L}}>{message.msg}</Text>
                  {
                      message.icon == null
                      ? <ActivityIndicator style={{marginTop: 10}} color={COLOR.YELLOW} />
                      : <FIcon5 style={{marginTop: 10}} size={30} color={COLOR.YELLOW} name={message.icon}/>
                  }
          </View> */}
        {/* 
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
            <View style={styles.inCapture}></View>
          </TouchableOpacity>
        </View> */}
      </View>
    </MainComponent>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    // height: 240,
    // width: 240,
    // borderRadius: 120,
    // overflow: 'hidden', // to make it circle
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  cameraBox: {
    height: CROP_AREA_HEIGHT,
    width: CROP_AREA_WIDTH,
    // borderRadius: CROP_AREA_WIDTH,
    // overflow: 'hidden', // to make it circle
    backgroundColor: 'rgba(255,255,255,0.1)',
    position: 'absolute',
  },
  preview: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  instructions: {
    height: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderEdges: {
    height: 40,
    width: 40,
    position: 'absolute',
    borderColor: COLOR.YELLOW,
  },
  backBtn: {
    top: Platform.OS === 'android' ? 30 : 10,
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    width: 35,
  },
  capture: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: COLOR.YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inCapture: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  retakeCameraBox: {
    borderColor: '#F6841F',
    borderWidth: 1,
    height: CROP_AREA_HEIGHT,
    width: CROP_AREA_WIDTH,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    transform: [
      {
        scaleX: -1,
      },
    ],
  },
  header: {
    backgroundColor: 'white',
    padding: moderateScale(15),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
    marginTop: Platform.OS === 'ios' ? 0 : getStatusbarHeight,
  },
});
