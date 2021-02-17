import React, {useState} from 'react';
import {View, StyleSheet, Text, Image, TouchableHighlight, Alert, Dimensions} from 'react-native';
import {useMutation} from '@apollo/react-hooks';
import ImageCropper from 'react-native-simple-image-cropper';
import {connect} from 'react-redux';
import DocumentPicker from 'react-native-document-picker';
import {ReactNativeFile} from 'apollo-upload-client';
import {PATCH_PERSON_PROFILE_PICTURE} from '../../../../graphql';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../components';
import {COLOR, DARK, MAP_DELTA_LOW, ORANGE, MEDIUM} from '../../../../res/constants';
import {onError} from '../../../../util/ErrorUtility';

const imageWidth = Dimensions.get('window').width - 40;

const CROP_AREA_WIDTH = imageWidth;
const CROP_AREA_HEIGHT = imageWidth;

const ChangeProfilePicture = ({navigation, route, session, createSession}) => {
  const {label} = route.params;
  const [image, setImage] = useState(false);
  const [cropperParams, setCropperParams] = useState({});

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={label} />,
  });

  const onCameraPress = () => {
    navigation.push('ProfileCamera', {label, setImage});
  };

  const handleSelectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      setImage(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const [patchPersonProfilePicture, {loading}] = useMutation(PATCH_PERSON_PROFILE_PICTURE, {
    onError: onError,
    onCompleted: ({patchPersonProfilePicture}) => {
      const newSession = {...session};
      newSession.user.person.avatar = patchPersonProfilePicture.avatar;
      newSession.user.person.avatarThumbnail = patchPersonProfilePicture.avatar;
      createSession(newSession);
      Alert.alert('', 'Profile picture successfully updated', [
        {
          title: 'Ok',
          onPress: () => navigation.pop(),
        },
      ]);
    },
  });

  const cropSize = {
    height: 480,
    width: 480,
  };

  const cropAreaSize = {
    width: CROP_AREA_WIDTH,
    height: CROP_AREA_HEIGHT,
  };

  const onConfirmPicture = async () => {
    try {
      const croppedResult = await ImageCropper.crop({
        ...cropperParams,
        imageUri: image.uri,
        cropSize,
        cropAreaSize,
      });

      const rnFile = new ReactNativeFile({
        uri: croppedResult,
        name: 'document.jpg',
        type: 'image/jpeg',
      });
      patchPersonProfilePicture({
        variables: {
          input: {
            tokUserId: session.user.person.id,
            file: rnFile,
          },
        },
      });
    } catch (error) {
      console.log(error);
      Alert.alert('', 'Sorry, we cannot process this image. Please select another one.');
    }
  };

  if (image) {
    return (
      <>
        <AlertOverlay visible={loading} />
        <View style={styles.container}>
          <View style={{height: imageWidth, width: imageWidth, margin: 20, borderRadius: 10}}>
            <ImageCropper
              imageUri={image.uri}
              cropAreaWidth={CROP_AREA_WIDTH}
              cropAreaHeight={CROP_AREA_HEIGHT}
              containerColor="black"
              areaColor="black"
              setCropperParams={cropperParams => setCropperParams(cropperParams)}
            />
          </View>
          <View style={{flexDirection: 'row', marginHorizontal: 20}}>
            <TouchableHighlight onPress={() => setImage(null)} underlayColor={COLOR} style={styles.imageButtonBox}>
              <View style={styles.submit}>
                <Text style={{color: COLOR, fontSize: 20}}>Discard</Text>
              </View>
            </TouchableHighlight>
            <View style={{width: 20}} />
            <TouchableHighlight onPress={onConfirmPicture} underlayColor={COLOR} style={styles.imageButtonBox}>
              <View style={styles.submit}>
                <Text style={{color: COLOR, fontSize: 20}}>Use</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableHighlight onPress={onCameraPress} underlayColor={COLOR} style={styles.submitBox}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 20}}>Take Picture</Text>
        </View>
      </TouchableHighlight>
      <TouchableHighlight onPress={handleSelectFile} underlayColor={COLOR} style={styles.submitBox}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 20}}>Select From Gallery</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangeProfilePicture);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  card: {
    flex: 1,
    width: '59%',
    margin: 49,
    backgroundColor: '#333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBox: {
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  imageButtonBox: {
    borderRadius: 10,
    flex: 1,
  },
  submit: {
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
