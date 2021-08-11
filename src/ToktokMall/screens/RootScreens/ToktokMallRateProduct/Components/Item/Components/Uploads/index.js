import React from 'react'
import {View, Image, TouchableOpacity, Text} from 'react-native'
import {launchImageLibrary} from 'react-native-image-picker'
import CustomIcon from '../../../../../../../Components/Icons'

export const Uploads = ({images, setRating, index}) => {
  const handleSelectFile = async () => {
    try {
      console.log('ImagePicker')
      launchImageLibrary({}, async (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker')
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error)
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton)
        } else {
          setRating({index, image: {action: 'add', data: response}})
        }
      })
    } catch (err) {
      throw err
    }
  }

  return (
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
            onPress={handleSelectFile}
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
  )
}
