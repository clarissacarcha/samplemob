import { useNavigation } from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker'
import {UploadModal} from '../../../../../../../Components';
import CustomIcon from '../../../../../../../Components/Icons';

export const Uploads = ({images, setRating, index}) => {
  const [visibility, setVisibility] = useState(false);
  const [image, setImage] = useState()
  const {navigate} = useNavigation()

  const handleSelectFile = async (callback) => {
    try {
      launchImageLibrary({}, async (response) => {
        if (response.didCancel) {
           console.log("User cancelled image picker");
         } else if (response.error) {
           console.log("ImagePicker Error: ", response.error);
         } else if (response.customButton) {
           console.log("User tapped custom button: ", response.customButton);
         } else {
          await callback()
          setRating({index, image: {action: 'add', data: response}});
        }
   })
    } catch (err) {
      throw err;
    }
  };

  const handleOpenCamera = (callback) => {
    callback()
    navigate("ToktokMallRateProductCamera", {setImage})
  }
  
  useEffect(() => {
    if(image){
      setRating({index, image: {action: 'add', data: image}});
    }
  },[image])

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
