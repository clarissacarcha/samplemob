import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions, FlatList, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useQuery} from '@apollo/react-hooks';
import {HeaderBack, HeaderTitle} from '../../../components';
import CONSTANTS from '../../../common/res/constants';

import LookingForPromos from '../../assets/images/LookingForPromos.png';
import FacebookLogo from '../../assets/images/FacebookLogo.png';
import InstagramLogo from '../../assets/images/InstagramLogo.png';

import {GET_SUPER_APP_PROMOS} from '../../../graphql';

const {COLOR, FONT_FAMILY} = CONSTANTS;

const bannerWidth = Dimensions.get('window').width - 32;

const promoData = [
  {
    banner: null,
    title: 'P1CHIBOG',
    header: 'No Minimum Spend',
    body: null,
    footer: 'Until March 22, 2022',
  },
];

const MorePromos = () => {
  return (
    <View style={styles.centerBox}>
      <Image source={LookingForPromos} style={styles.morePromosImage} resizeMode="contain" />
      <Text style={styles.lookingText}>Looking for promos?</Text>
      <Text style={styles.text}>Checkout our social media pages</Text>
      <Text style={styles.text}>to get the latest updates!</Text>
      <View style={styles.mediaBox}>
        <Image source={FacebookLogo} style={styles.mediaImage} resizeMode="contain" />
        <Text style={styles.mediaText}>toktokphilippines</Text>
        <Image source={InstagramLogo} style={styles.mediaImage} resizeMode="contain" />
        <Text style={styles.mediaTextRight}>toktokph</Text>
      </View>
    </View>
  );
};

const PromoItem = ({item}) => {
  const {banner, title, header, body, footer} = item;

  //   console.log({banner, title, header, body, footer});

  return (
    <View style={styles.promoBox}>
      {/* <View style={styles.promoBanner} /> */}
      <Image source={{uri: banner}} style={styles.promoBanner} />
      <View style={styles.promoTextBox}>
        <Text style={styles.promoTitle}>{title}</Text>
        <Text style={styles.promoHeader}>{header}</Text>
      </View>
      <View style={styles.promoFooterBox}>
        <Text style={styles.promoFooter}>{footer}</Text>
      </View>
    </View>
  );
};

export const SuperAppPromosScreen = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Promos', '']} />,
  });

  const {data, loading, error} = useQuery(GET_SUPER_APP_PROMOS, {
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return (
      <View style={[styles.container, styles.centerBox]}>
        <ActivityIndicator size={24} color={COLOR.ORANGE} />
      </View>
    );
  }

  if (data.getSuperAppPromos.length === 0) {
    return (
      <View style={[styles.container, styles.centerBox]}>
        <MorePromos />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data.getSuperAppPromos}
        renderItem={PromoItem}
        contentContainerStyle={{paddingTop: 8}}
        ListFooterComponent={() => (
          <View style={{marginBottom: 24}}>
            <MorePromos />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaBox: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
  },
  promoBox: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  promoBanner: {
    height: bannerWidth / 2,
  },
  prompoTextBox: {
    paddingHorizontal: 16,
  },
  promoTitle: {
    marginTop: 16,
    fontFamily: FONT_FAMILY.BOLD,
  },
  promoTextBox: {
    width: '100%',
    paddingHorizontal: 16,
  },
  promoFooterBox: {
    width: '100%',
    borderTopWidth: 2,
    paddingHorizontal: 16,
    borderTopColor: COLOR.LIGHT,
  },

  promoFooter: {
    marginVertical: 16,
  },
  promoHeader: {
    marginTop: 8,
    marginBottom: 16,
  },
  morePromosImage: {
    height: 160,
    borderWidth: 1,
    width: 160,
    alignSelf: 'center',
  },
  mediaImage: {
    height: 17,
    width: 17,
    marginRight: 8,
  },
  mediaText: {
    marginRight: 16,
    color: '#525252',
  },
  mediaTextRight: {
    color: '#525252',
  },
  lookingText: {
    color: COLOR.ORANGE,
    fontFamily: FONT_FAMILY.BOLD,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    alignSelf: 'center',
  },
});

{
  /* <FastImage
source={{uri: source}}
resizeMode={FastImage.resizeMode.cover}
style={{
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: '#fff',
  ...style,
}}
/> */
}
