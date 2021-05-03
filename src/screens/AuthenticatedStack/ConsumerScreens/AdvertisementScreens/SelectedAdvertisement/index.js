import React from 'react';
import {View, StyleSheet, Text, Dimensions, Image, ScrollView} from 'react-native';
import {COLOR, FONT, SIZE} from '../../../../../res/variables';
import {HeaderBack, HeaderTitle} from '../../../../../components';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BANNER_WIDTH = SCREEN_WIDTH - SIZE.MARGIN * 2;
const BANNER_HEIGHT = BANNER_WIDTH / 2;

const AdImage = ({advertisement}) => {
  const {isHighlighted, squareImage, rectangleImage} = advertisement;

  const imageUri = isHighlighted ? rectangleImage : squareImage;

  return (
    <Image
      style={styles.image}
      source={{
        uri: imageUri,
      }}
      resizeMode="contain"
    />
  );
};

const Title = ({advertisement}) => {
  return (
    <>
      <Text style={styles.title}>{advertisement.title}</Text>
      <Text style={styles.date}>{advertisement.startDuration}</Text>
    </>
  );
};

const Body = ({body}) => {
  return <Text style={styles.body}>{body}</Text>;
};

const SelectedAdvertisement = ({navigation, route}) => {
  const advertisement = route.params.advertisement;

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['', '']} />,
  });

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AdImage advertisement={advertisement} />
        <Title advertisement={advertisement} />
        <Body body={advertisement.description} />
        <Body body={advertisement.description} />
      </ScrollView>
    </View>
  );
};

export default SelectedAdvertisement;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  image: {
    height: BANNER_HEIGHT,
    width: BANNER_WIDTH,
    borderRadius: 5,
    margin: SIZE.MARGIN,
    // backgroundColor: COLOR.MEDIUM,
  },
  title: {
    fontFamily: FONT.BOLD,
    marginHorizontal: SIZE.MARGIN,
  },
  date: {
    marginHorizontal: SIZE.MARGIN,
    color: COLOR.DARK,
  },
  body: {
    margin: SIZE.MARGIN,
    textAlign: 'justify',
  },
});
