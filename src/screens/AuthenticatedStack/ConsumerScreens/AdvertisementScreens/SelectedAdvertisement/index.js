import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Dimensions, Image, ScrollView} from 'react-native';
import {COLOR, FONT, SIZE} from '../../../../../res/variables';
import {HeaderBack, HeaderTitle} from '../../../../../components';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BANNER_WIDTH = SCREEN_WIDTH - SIZE.MARGIN * 2;
const BANNER_HEIGHT = BANNER_WIDTH / 2;

const getImageDimensions = (uri) => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => {
        resolve({width: width, height: height});
      },
      (error) => {
        reject(error);
      },
    );
  });
};

const AdImage = ({advertisement}) => {
  const [imageDimension, setImageDimension] = useState(null);

  const {isHighlighted, squareImage, rectangleImage} = advertisement;

  const imageUri = isHighlighted ? rectangleImage : squareImage;

  const getImage = async () => {
    const result = await getImageDimensions(imageUri);
    const width = BANNER_WIDTH;

    const height = (width / result.width) * result.height;

    setImageDimension({
      width,
      height,
    });
  };

  useEffect(() => {
    getImage();
  }, []);

  if (imageDimension) {
    return (
      <Image
        source={{
          uri: imageUri,
        }}
        style={[styles.image, {height: imageDimension.height}]}
        resizeMode="cover"
      />
    );
  }

  return <View style={styles.image} />;
};

const Title = ({advertisement}) => {
  return (
    <>
      <Text style={styles.title}>{advertisement.title}</Text>
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
    backgroundColor: 'red',
  },
  imageBox: {
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'red',
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
