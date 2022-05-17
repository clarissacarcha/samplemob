import React from 'react'
import {View, Image, Text, TextInput, TouchableOpacity, Platform} from 'react-native'
import {Rate, Uploads} from './Components'

export const Item = ({index, setRating, rating: {star, feedback, images}, ...data}) => {

  const onChangeText = (text) => {
    setRating({index, feedback: text})
  }

  const getImage = (src) => {
    if(typeof src == "string") return {uri: src}
    else return require('../../../../../assets/images/coppermask.png')
  }

  return (
    <View style={{flex: 1, marginTop: 10, paddingBottom: 15, backgroundColor: '#FFF'}}>
      <View style={{flexDirection: 'row', paddingTop: 10, padding: 15}}>
        <Image
          source={getImage(data.image)}
          style={{width: 55, height: 60, resizeMode: 'stretch', borderRadius: 5}}
        />
        <View style={{marginLeft: 15}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={{fontSize: 13, fontWeight: '100'}}>{data.label}</Text>
            <Text style={{color: '#9E9E9E', fontSize: 13}}>Variation: {data.variation}</Text>
          </View>
        </View>
      </View>
      <View style={{height: 2, backgroundColor: '#F7F7FA'}} />

      <View style={{alignItems: 'center', paddingTop: 40}}>
        <Text style={{fontSize: 16, fontWeight: '100'}}>How was your purchase</Text>
        <Text style={{color: '#9E9E9E', fontSize: 13}}>Kindly select a star rating</Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'center', paddingVertical: 20}}>
        <Rate {...{star, setRating, index}}/>
      </View>

      <View
        style={{
          minHeight: 150,
          paddingHorizontal: 15,
          paddingTop: Platform.OS === 'ios' ? 15 : 0,
          marginHorizontal: 15,
          borderColor: 'rgba(33, 37, 41, 0.1)',
          borderRadius: 5,
          borderWidth: 2,
        }}>
        <TextInput multiline value={feedback} placeholder="(Write your feedback here)" onChangeText={onChangeText} />
      </View>
      <Uploads {...{images, setRating,index}}/>
    </View>
  )
}
