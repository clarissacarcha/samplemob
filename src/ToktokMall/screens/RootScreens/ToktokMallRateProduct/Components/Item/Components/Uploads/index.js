import React, {useState} from 'react';
import {View, Image, TouchableOpacity, Text} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import {UploadModal} from '../../../../../../../Components';
import CustomIcon from '../../../../../../../Components/Icons';

export const Uploads = ({images, setRating, index}) => {
  const [visibility, setVisibility] = useState(false);

  const handleSelectFile = async () => {
    try {
      launchImageLibrary({}, async (response) => {
        console.log(response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          setRating({index, image: {action: 'add', data: response}});
        }
      });
    } catch (err) {
      throw err;
    }
  };
  const handleOpenCamera = async () => {
    try {
      launchCamera({}, async (response) => {
        console.log(response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          Toast.show(response.errorCode);
        } else {
          setRating({index, image: {action: 'add', data: response}});
        }
      });
    } catch (err) {
      throw err;
    }
  };

  const modalActions = [
    {
      icon: require('../../../../../../../../assets/icons/camera.png'),
      name: 'Take Photo',
      onPress: handleOpenCamera,
    },
    {
      icon: require('../../../../../../../../assets/icons/upload.png'),
      name: 'Upload Photo',
      onPress: handleSelectFile,
    },
  ];

  return (
    <>
      {visibility && <UploadModal isVisible={visibility} setIsVisible={setVisibility} actions={modalActions} />}
      <View
        style={{
          alignItems: 'center',
          marginTop: 15,
          paddingTop: 15,
        }}>
        <View style={{flexDirection: 'row', marginLeft: -15}}>
          {images.map(({uri}, i) => (
            <View style={{marginHorizontal: 12}}>
              <CustomIcon.AIcon
                name="closecircle"
                color="#9E9E9E"
                size={15}
                style={{
                  position: 'absolute',
                  top: -13,
                  right: -17,
                  zIndex: 1,
                }}
                onPress={() => setRating({index, image: {action: 'remove', index: i}})}
              />
              <Image style={{height: 54, width: 54, borderRadius: 5}} source={{uri}} />
            </View>
          ))}
          {images.length < 5 && (
            <TouchableOpacity
              onPress={setVisibility.bind(this, true)}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderStyle: 'dashed',
                borderColor: '#9E9E9E',
                borderRadius: 5,
                borderWidth: 2,
                padding: 15,
                marginHorizontal: 12,
              }}>
              <CustomIcon.FA5Icon name="camera" color="#9E9E9E" size={20} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};
