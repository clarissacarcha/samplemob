import {APP_FLAVOR, COLOR, DARK, LIGHT} from '../res/constants';
import {Dimensions, Image, ScrollView, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import React, {useState} from 'react';

import {GET_WELCOME_BANNER} from '../graphql/model/WelcomeBanner';
import {useQuery} from '@apollo/react-hooks';

const cardWidth = Dimensions.get('window').width - 40;
const cardHeight = Dimensions.get('window').height * 0.6;

export const WelcomeBanner = () => {
  const [showBanner, setShowBanner] = useState(true);
  const {data, loading, error} = useQuery(GET_WELCOME_BANNER, {
    variables: {
      filter: {
        appFlavor: APP_FLAVOR,
      },
    },
  });

  if (loading) {
    return null;
  }

  if (error) {
    return null;
  }

  if (!data.getWelcomeBanner) {
    return null;
  }

  if (!showBanner) {
    return null;
  }

  return (
    <View style={styles.absolute}>
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>{data.getWelcomeBanner.title}</Text>
        </View>

        <View style={styles.imageBox}>
          <Image
            source={{uri: data.getWelcomeBanner.image}}
            style={{height: (cardWidth - 40) / 2, width: cardWidth - 40}}
            resizeMode="cover"
          />
        </View>

        <View style={styles.messageBox}>
          <ScrollView>
            <Text>{data.getWelcomeBanner.message}</Text>
          </ScrollView>
        </View>

        <TouchableHighlight
          onPress={() => {
            setShowBanner(false);
          }}
          underlayColor={COLOR}
          style={styles.submitBox}>
          <View style={styles.submit}>
            <Text style={styles.okay}>Okay</Text>
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
  container: {
    height: cardHeight,
    backgroundColor: 'white',
    borderRadius: 10,
    width: cardWidth,
    margin: 60,
    overflow: 'hidden',
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
  title: {
    color: DARK,
    fontSize: 20,
    textAlign: 'center',
  },
  titleBox: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: COLOR,
    alignItems: 'center',
  },
  imageBox: {
    height: (cardWidth - 40) / 2,
    backgroundColor: LIGHT,
    margin: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  messageBox: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 20,
  },
  okay: {
    color: COLOR,
    fontSize: 20,
  },
});
