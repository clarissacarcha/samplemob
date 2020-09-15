import React from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableHighlight, ScrollView, Image} from 'react-native';
import {COLOR, DARK, LIGHT} from '../res/constants';

const cardWidth = Dimensions.get('window').width - 40;
const cardHeight = Dimensions.get('window').height * 0.6;

export const WelcomeMessage = ({data, onOkay}) => {
  const {title, body, image} = data;
  return (
    <View style={styles.absolute}>
      <View
        style={{
          height: cardHeight,
          backgroundColor: 'white',
          borderRadius: 10,
          width: cardWidth,
          margin: 60,
          overflow: 'hidden',
        }}>
        <View style={{paddingVertical: 15, paddingHorizontal: 20, backgroundColor: COLOR, alignItems: 'center'}}>
          <Text style={{color: DARK, fontSize: 20, textAlign: 'center'}}>{title}</Text>
        </View>

        <View
          style={{
            height: (cardWidth - 40) / 2,
            backgroundColor: LIGHT,
            margin: 20,
            borderRadius: 10,
            overflow: 'hidden',
          }}>
          <Image
            source={{uri: image}}
            style={{height: (cardWidth - 40) / 2, width: cardWidth - 40}}
            resizeMode="cover"
          />
        </View>

        <View style={{flex: 1, backgroundColor: 'white', marginHorizontal: 20}}>
          <ScrollView>
            <Text>{body}</Text>
          </ScrollView>
        </View>

        <TouchableHighlight onPress={onOkay} underlayColor={COLOR} style={styles.submitBox}>
          <View style={styles.submit}>
            <Text style={{color: COLOR, fontSize: 20}}>Okay</Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  absolute: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBox: {
    margin: 20,
    borderRadius: 10,
  },
  submit: {
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
