import React, {useState} from 'react';
import {View, Image, Text, TextInput, TouchableOpacity, Platform} from 'react-native';
import CustomIcon from '../../../../../Components/Icons';
import {Rate} from '../Rate';

export const Item = (data) => {
  const [rating, setRating] = useState(0);

  return (
    <View style={{flex: 1, marginTop: 10, paddingBottom: 15, backgroundColor: '#FFF'}}>
      <View style={{flexDirection: 'row', paddingTop: 10, padding: 15}}>
        <Image
          source={require('../../../../../assets/images/coppermask.png')}
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
        <Rate {...{rating, setRating}} value={1} />
        <Rate {...{rating, setRating}} value={2} />
        <Rate {...{rating, setRating}} value={3} />
        <Rate {...{rating, setRating}} value={4} />
        <Rate {...{rating, setRating}} value={5} />
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
        <TextInput multiline placeholder="(Write your feedback here)" />
      </View>
      <TouchableOpacity
        style={{
          alignItems: 'center',
          marginTop: 15,
          marginHorizontal: 15,
          paddingVertical: 15,
          borderStyle: 'dashed',
          borderColor: '#9E9E9E',
          borderRadius: 5,
          borderWidth: 2,
        }}>
        <CustomIcon.FA5Icon name="camera" color="#9E9E9E" size={25} />
        <Text style={{color: '#9E9E9E', fontSize: 15, paddingTop: 5}}>Upload Photo</Text>
      </TouchableOpacity>
    </View>
  );
};
