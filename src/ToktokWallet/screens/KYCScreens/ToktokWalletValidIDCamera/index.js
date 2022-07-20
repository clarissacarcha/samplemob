import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  ImageBackground,
  Alert,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import ImageCropper from 'react-native-simple-image-cropper';
import EIcon from 'react-native-vector-icons/EvilIcons';
import {CheckIdleState, PreviousNextButton, HeaderTitleRevamp} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';
import {camera_icon, camera_circle} from 'toktokwallet/assets';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;

const {width, height} = Dimensions.get('window');

const CROP_AREA_WIDTH = width * 0.9;
const CROP_AREA_HEIGHT = height * 0.3;

const MainComponent = ({checkTimeout, children}) => {
  if (checkTimeout) {
    return <CheckIdleState>{children}</CheckIdleState>;
  }

  return <>{children}</>;
};

export const ToktokWalletValidIDCamera = ({navigation, route}) => {
  navigation.setOptions({
    headerShown: false,
  });

  // const [image,setImage] = useState(null)
  const cameraRef = useRef(null);
  const [tempImage, setTempImage] = useState(null);
  const [cropperParams, setCropperParams] = useState({});
  const [takingPicture, setTakingPicture] = useState(false);
  const checkTimeout = route?.params?.checkTimeout ? true : false;

  const title = route?.params?.placement == 'front' ? 'Front of ID' : 'Back of ID';

  const takePicture = async () => {
    try {
      if (cameraRef) {
        const options = {
          quality: 1,
          width: 1024,
          fixOrientation: true,
          orientation: 'portrait',
          autoFocus: true,
        };
        setTakingPicture(true);
        const data = await cameraRef.current.takePictureAsync(options);
        setTempImage(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cropSize = {
    width: Platform.OS === 'ios' ? CROP_AREA_WIDTH : CROP_AREA_WIDTH + 700,
    height: Platform.OS === 'ios' ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT + 700,
  };

  const cropAreaSize = {
    width: Platform.OS === 'ios' ? CROP_AREA_WIDTH : CROP_AREA_WIDTH,
    height: Platform.OS === 'ios' ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT + 40,
  };

  useEffect(() => {
    if (Platform.OS === 'android' && tempImage && cropperParams && takingPicture) {
      androidCrop(tempImage, cropperParams);
    }
  }, [cropperParams, takingPicture]);

  const androidCrop = async data => {
    try {
      setTakingPicture(false);
      const croppedResult = await ImageCropper.crop({
        ...cropperParams,
        imageUri: data.uri,
        cropAreaSize,
        cropSize,
      });
      setTempImage({
        ...data,
        uri: croppedResult,
      });
    } catch (error) {
      console.log(error);
      Alert.alert('', 'Sorry, we cannot process this image. Please select another one.');
    }
  };

  const confirmAndroidPicture = tempImage => {
    route.params.setImage(tempImage, route.params.placement);
    navigation.pop();
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
        route.params.placement,
      ); //front or back
      navigation.pop();
    } catch (error) {
      console.log(error);
      Alert.alert('', 'Sorry, we cannot process this image. Please select another one.');
    }
  };

  if (tempImage) {
    return (
      <MainComponent checkTimeout={checkTimeout}>
        <View style={styles.header}>
          <HeaderTitleRevamp label={'Upload Valid ID'} />
        </View>
        <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
            <View style={styles.retakeCameraBox}>
              <View
                style={{
                  paddingVertical: 10,
                  position: 'absolute',
                  top: -100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <Text style={styles.titleText}>{title}</Text>
              </View>
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
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.pop()} style={styles.backBtn}>
          <FIcon5 name="chevron-left" size={16} color={'#F6841F'} />
        </TouchableOpacity>
        <View style={styles.cameraContainer}>
          <RNCamera
            ref={cameraRef}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.off}
            captureAudio={false}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'}}>
              <View style={styles.cameraBox}>
                <View
                  style={{
                    position: 'absolute',
                    top: Platform.OS === 'ios' ? -70 : -100,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.titleText}>{title}</Text>
                </View>
                <View style={[styles.borderEdges, {borderTopWidth: 6, borderLeftWidth: 6, top: 0, left: 0}]} />
                <View style={[styles.borderEdges, {borderTopWidth: 6, borderRightWidth: 6, top: 0, right: 0}]} />
                <View style={[styles.borderEdges, {borderBottomWidth: 6, borderLeftWidth: 6, bottom: 0, left: 0}]} />
                <View style={[styles.borderEdges, {borderBottomWidth: 6, borderRightWidth: 6, bottom: 0, right: 0}]} />

                <View
                  style={{position: 'absolute', bottom: -100, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={styles.position}>Position your ID within the frame.</Text>
                  <Text style={styles.blurText}>Make sure the picture has no glare and not blur.</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                bottom: 0,
                width: '100%',
                marginBottom: 30,
                position: 'absolute',
              }}>
              <TouchableOpacity onPress={() => takePicture()}>
                <ImageBackground source={camera_circle} style={styles.capture} resizeMode="contain">
                  <View style={styles.inCapture}>
                    <Image source={camera_icon} style={{height: 55, width: 55}} />
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </RNCamera>
        </View>
      </View>
    </MainComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraBox: {
    borderColor: '#F6841F',
    borderWidth: 1,
    height: CROP_AREA_HEIGHT,
    width: CROP_AREA_WIDTH,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeCameraBox: {
    borderColor: '#F6841F',
    borderWidth: 1,
    height: CROP_AREA_HEIGHT,
    width: CROP_AREA_WIDTH,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.XL,
    color: 'white',
    textAlign: 'center',
  },
  actions: {
    flexBasis: 80,
  },
  capture: {
    height: moderateScale(60),
    width: moderateScale(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  position: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    color: 'white',
    paddingHorizontal: moderateScale(5),
    paddingVertical: moderateScale(2),
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 5,
  },
  blurText: {
    marginTop: moderateScale(5),
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    color: 'white',
    paddingHorizontal: moderateScale(5),
    paddingVertical: moderateScale(2),
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 5,
  },
  actionbtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(10),
    borderRadius: 5,
    height: SIZE.FORM_HEIGHT,
  },
  borderEdges: {
    height: moderateScale(40),
    width: moderateScale(40),
    position: 'absolute',
    borderColor: '#F6841F',
    zIndex: 1,
  },
  backBtn: {
    top: Platform.OS === 'android' ? 30 : 10,
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: moderateScale(35),
    width: moderateScale(35),
  },
  header: {
    backgroundColor: 'white',
    // padding: moderateScale(15),
    paddingHorizontal: moderateScale(13),
    paddingVertical: moderateScale(13),
    marginTop: Platform.OS === 'ios' ? 0 : getStatusbarHeight,
  },
});
