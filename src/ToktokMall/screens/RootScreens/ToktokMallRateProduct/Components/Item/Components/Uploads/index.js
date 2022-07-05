import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { UploadModal } from '../../../../../../../Components';
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
      {visibility && 
        <UploadModal 
          isVisible={visibility} 
          setIsVisible={setVisibility} 
          actions={modalActions} 
        />}

      <View style={styles.container}>
        <View style={styles.subContainer}>
          {images.map(({uri}, i) => (
            <View style={{marginHorizontal: 12}}>
              <CustomIcon.AIcon
                name="closecircle"
                color="#9E9E9E"
                size={15}
                style={styles.customIcon}
                onPress={() => setRating({index, image: {action: 'remove', index: i}})}
              />
              <Image style={styles.image} source={{uri}} />
            </View>
          ))}
          {images.length < 5 && (
            <TouchableOpacity
              onPress={setVisibility.bind(this, true)}
              style={styles.button}>
              <CustomIcon.FA5Icon name="camera" color="#9E9E9E" size={20} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
  },
  subContainer: {
    flexDirection: 'row', 
    marginLeft: -15
  },
  customIcon: {
    position: 'absolute',
    top: -13,
    right: -17,
    zIndex: 1,
  },
  image: {
    height: 54, 
    width: 54, 
    borderRadius: 5
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderColor: '#9E9E9E',
    borderRadius: 5,
    borderWidth: 2,
    padding: 15,
    marginHorizontal: 12,
  }
});
