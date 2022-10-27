import React, {useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Image, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';

// FONTS, COLORS AND IMAGES
import {download_icon} from 'toktokload/assets/icons';

//HELPER
import {moderateScale} from 'toktokwallet/helper';
import moment from 'moment';
import {usePrompt} from 'src/hooks';

export const HeaderDownloadReceipt = ({
  onPress,
  color = '#F6841F',
  viewshotRef = null,
  refNo,
  format,
  onPressDownloadReceipt,
}) => {
  const navigation = useNavigation();
  const prompt = usePrompt();

  const checkAndRequest = Platform.select({
    android: async () => {
      const checkResult = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
      if (checkResult === RESULTS.GRANTED) {
        return true;
      }
      if (checkResult === RESULTS.BLOCKED) {
        Alert.alert(
          '',
          "Read storage access have been blocked. Please allow toktok to access your storage in your phone's settings.",
        );
        return false;
      }
      if (checkResult === RESULTS.UNAVAILABLE) {
        Alert.alert('', 'Access to storage is unavailable.');
        return false;
      }

      if (checkResult === RESULTS.DENIED) {
        const requestResult = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);

        if (checkResult === RESULTS.GRANTED) {
          return true;
        }
        if (checkResult === RESULTS.BLOCKED) {
          Alert.alert(
            '',
            "Read storage access have been blocked. Please allow toktok to access your storage in your phone's settings.",
          );
          return false;
        }
        if (requestResult === RESULTS.DENIED) {
          Alert.alert('', "Sorry, we can't access your storage without sufficient permission.");
          return false;
        }
      }
    },
    ios: async () => {
      const checkResult = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);

      if (checkResult === RESULTS.GRANTED) {
        return true;
      }
      if (checkResult === RESULTS.BLOCKED) {
        Alert.alert(
          '',
          "Read storage access have been blocked. Please allow toktok to access your storage in your phone's settings.",
        );
        return false;
      }
      if (checkResult === RESULTS.UNAVAILABLE) {
        Alert.alert('', 'Access to storage is unavailable.');
        return false;
      }

      if (checkResult === RESULTS.DENIED) {
        const requestResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        if (requestResult === RESULTS.GRANTED) {
          return true;
        }

        if (requestResult === RESULTS.BLOCKED) {
          Alert.alert(
            '',
            "Read storage access have been blocked. Please allow toktok to access your storage in your phone's settings.",
          );
          return false;
        }
      }
    },
  });

  const downloadReceipt = async () => {
    onPressDownloadReceipt(true);

    const result = await checkAndRequest();

    const pathCache = RNFS.CachesDirectoryPath;
    console.log(pathCache);
    setTimeout(() => {
      viewshotRef.current.capture().then(async uri => {
        const timestamp = +moment();
        const filename = `${timestamp.toString()}_${refNo}.${format ? format : 'jpg'}`;

        RNFS.moveFile(uri, pathCache + `/${filename}`);
        const newFileUri = `${pathCache}/${filename}`;

        await CameraRoll.save(newFileUri, {type: 'photo', album: 'toktok'});

        prompt({
          type: 'success',
          title: 'Receipt Downloaded',
          message: 'Your transaction receipt has been saved to your gallery.',
          event: 'TOKTOKBILLSLOAD',
        });
        onPressDownloadReceipt(false);
      });
    }, 1000);
  };

  return (
    <TouchableOpacity onPress={downloadReceipt} style={styles.backContainer}>
      <Image
        source={download_icon}
        style={{width: moderateScale(20), height: moderateScale(20), resizeMode: 'contain'}}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backContainer: {
    paddingHorizontal: 15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
