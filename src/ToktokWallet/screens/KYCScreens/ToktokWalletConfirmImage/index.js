import React, {useRef, useState, useEffect, useMemo} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import ImageCropper from 'react-native-simple-image-cropper';
import {CheckIdleState, PreviousNextButton, HeaderTitleRevamp} from 'toktokwallet/components';
import FIcon from 'react-native-vector-icons/FontAwesome5';
import CONSTANTS from 'common/res/constants';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

const {width, height} = Dimensions.get('window');

export const ToktokWalletConfirmImage = ({route, navigation}) => {
  const {cropAreaWidth, cropAreaHeight, tempImage: tempImageValue, takingPicture: takePic} = route.params.imageDetails;
  const {navigateTo, screenLabel} = route.params.screen;
  const [cropperParams, setCropperParams] = useState(null);
  const [takingPicture, setTakingPicture] = useState(takePic);
  const [tempImage, setTempImage] = useState(tempImageValue);

  navigation.setOptions({
    headerLeft: null,
    headerTitle: () => <HeaderTitleRevamp label={screenLabel} />,
  });

  const cropSize = {
    width: Platform.OS === 'ios' ? cropAreaWidth : cropAreaWidth + 700,
    height: Platform.OS === 'ios' ? cropAreaHeight : cropAreaHeight + 700,
  };

  const cropAreaSize = {
    width: cropAreaWidth - 70,
    height: cropAreaHeight - 70,
  };

  useEffect(() => {
    if (Platform.OS === 'android' && tempImage && cropperParams && takingPicture) {
      androidCrop(tempImage, cropperParams);
    }
  }, [cropperParams]);

  const clearStates = () => {
    setCropperParams(null);
  };

  const androidCrop = async () => {
    try {
      // setTakingPicture(false);
      const croppedResult = await ImageCropper.crop({
        ...cropperParams,
        imageUri: tempImage.uri,
        cropAreaSize,
        cropSize,
      });
      setTempImage({
        ...tempImage,
        uri: croppedResult,
      });
      setTakingPicture(false);
    } catch (error) {
      console.log(error);
      Alert.alert('', 'Sorry, we cannot process this image. Please select another one.');
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
          <View style={[styles.retakeCameraBox, {width: cropAreaWidth, height: cropAreaHeight}]}>
            {takingPicture && Platform.OS === 'android' && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLOR.ORANGE} />
              </View>
            )}
            <ImageCropper
              imageUri={tempImage?.uri}
              cropAreaWidth={cropAreaWidth}
              cropAreaHeight={cropAreaHeight}
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
            navigation.replace(navigateTo, {setImage: route.params.setImage});
          }}
          onPressNext={() => {
            route.params.onCallBack(tempImage);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
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
  loadingContainer: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
});
