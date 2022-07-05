import React from 'react'
import { View, Image, Text, TextInput, StyleSheet, Platform } from 'react-native'
import { Rate, Uploads } from './Components'

export const Item = ({index, setRating, rating: {star, feedback, images}, ...data}) => {

  const onChangeText = (text) => {
    setRating({index, feedback: text})
  }

  const getImage = (src) => {
    if(typeof src == "string") return {uri: src}
    else return require('../../../../../assets/images/coppermask.png')
  }

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <Image
          source={getImage(data.image)}
          style={styles.itemImages}
        />
        <View style={{ marginLeft: 15 }}>
          <View style={styles.itemText}>
            <Text style={styles.label}>{data.label}</Text>
            <Text style={styles.variation}>Variation: {data.variation}</Text>
          </View>
        </View>
      </View>
      <View style={styles.line} />

      <View style={styles.text1}>
        <Text style={styles.text2}>How was your purchase</Text>
        <Text style={styles.text3}>Kindly select a star rating</Text>
      </View>
      <View style={styles.rateContainer}>
        <Rate {...{star, setRating, index}}/>
      </View>

      <View
        style={styles.textInputContainer}>
        <TextInput 
          multiline 
          value={feedback} 
          placeholder="(Write your feedback here)" 
          onChangeText={onChangeText} 
        />
      </View>
      <Uploads {...{images, setRating,index}}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    marginTop: 10, 
    paddingBottom: 15, 
    backgroundColor: '#FFF'
  },
  itemContainer: {
    flexDirection: 'row', 
    paddingTop: 10, 
    padding: 15
  },
  itemImages: {
    width: 55, 
    height: 60, 
    resizeMode: 'stretch', 
    borderRadius: 5
  },
  itemText: {
    flex: 1, 
    justifyContent: 'center'
  },
  label: {
    fontSize: 13, 
    fontWeight: '100'
  },
  variation: {
    color: '#9E9E9E', 
    fontSize: 13
  },
  line: {
    height: 2, 
    backgroundColor: '#F7F7FA'
  },
  rateContainer: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    paddingVertical: 20
  },
  textInputContainer: {
    minHeight: 150,
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 15 : 0,
    marginHorizontal: 15,
    borderColor: 'rgba(33, 37, 41, 0.1)',
    borderRadius: 5,
    borderWidth: 2,
  },
  text1: {
    alignItems: 'center', 
    paddingTop: 40
  },
  text2: {
    fontSize: 16, 
    fontWeight: '100'
  },
  text3: {
    color: '#9E9E9E', 
    fontSize: 13
  }
});
