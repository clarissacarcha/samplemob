import React from 'react';
import {Text, View, StyleSheet, Dimensions, TouchableOpacity, Linking, Image, StatusBar} from 'react-native';
import {connect} from 'react-redux';

import FIcon from 'react-native-vector-icons/Feather';

const getDimensionsForWidth = ({image, imgWidth, imgHeight, targetWidth}) => {
  const ratio = targetWidth / imgWidth;
  const height = imgHeight * ratio;

  return {
    height,
    width: targetWidth,
  };
};
import ToktokgoComingSoonA from '../../../../assets/images/comingSoon/toktokgo/GoComingSoonA.png';
import ToktokgoComingSoonB from '../../../../assets/images/comingSoon/toktokgo/GoComingSoonB.png';
import ToktokgoComingSoonC from '../../../../assets/images/comingSoon/toktokgo/GoComingSoonC.png';
import ToktokgoComingSoonD from '../../../../assets/images/comingSoon/toktokgo/GoComingSoonD.png';
import ToktokgoComingSoonE from '../../../../assets/images/comingSoon/toktokgo/GoComingSoonE.png';

const imageWidth = Dimensions.get('window').width;

const resizeBasedOnOriginalImage = () => {};

const SectionImage = ({image, figmaHeight}) => {
  return (
    <Image
      source={image}
      // source={{
      //   uri: constants.toktokfoodComingSoonBodyImage,
      // }}
      resizeMode="contain"
      style={{
        height: figmaHeight,
      }}
    />
  );
};

const Screen = ({constants, navigation}) => {
  const pop = () => {
    navigation.pop();
  };

  const openLink = async () => {
    const result = await Linking.openURL(constants.toktokgoComingSoonLink);

    if (!result) {
      alert('Unable to open link.');
    }
  };

  return (
    <View style={styles.background}>
      <TouchableOpacity
        onPress={pop}
        style={{
          position: 'absolute',
          height: 50,
          width: 50,
          backgroundColor: 'transparent',
          top: 5 + StatusBar.currentHeight,
          left: 5,
          zIndex: 10,
        }}>
        <FIcon name="chevron-left" size={40} color="#F38220" />
      </TouchableOpacity>
      <View style={{flex: 1}} />
      <SectionImage image={ToktokgoComingSoonA} figmaHeight={45} />
      <View style={{flex: 1}} />
      <SectionImage image={ToktokgoComingSoonB} figmaHeight={72} />
      <View style={{flex: 1}} />
      <SectionImage image={ToktokgoComingSoonC} figmaHeight={200} />
      <View style={{flex: 1}} />
      <SectionImage image={ToktokgoComingSoonD} figmaHeight={72} />
      <View style={{flex: 1}} />
      <SectionImage image={ToktokgoComingSoonE} figmaHeight={44} />
      {/* <Image
        // source={ToktokfoodComingSoonHead}
        source={{
          uri: constants.toktokfoodComingSoonHeadImage,
        }}
        resizeMode="contain"
        style={{height: imageWidth, width: imageWidth - 80, marginTop: StatusBar.currentHeight}}
      /> */}
      {/* <Image
        // source={ToktokfoodComingSoonBody}
        source={{
          uri: constants.toktokfoodComingSoonBodyImage,
        }}
        resizeMode="contain"
        style={{...getDimensionsForWidth({imgWidth: 1243, imgHeight: 534, targetWidth: imageWidth - 80})}}
      /> */}
      <View style={{flex: 1}} />
      <View style={styles.body}>
        <View style={styles.buttonBox}>
          <TouchableOpacity style={styles.button} onPress={openLink}>
            <Text style={styles.text}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 1}} />
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
  constants: state.constants,
});

export default connect(mapStateToProps, null)(Screen);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFF5DC',
    alignItems: 'center',
    // justifyContent: 'flex-end',
    paddingTop: StatusBar.currentHeight,
  },
  body: {
    height: 50,
    width: '100%',
  },
  buttonBox: {
    height: 50,
    justifyContent: 'center',
    marginHorizontal: 80,
  },
  button: {
    height: 50,
    borderRadius: 50,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F38220',
  },
  text: {
    fontSize: 20,
    fontFamily: 'FiraSans-Bold',
    color: '#FFF5DC',
  },
  textOrange: {
    color: '#F38220',
    fontFamily: 'FiraSans-Bold',
    fontSize: 25,
  },
  textYellow: {
    color: '#ECBA43',
    fontFamily: 'FiraSans-Bold',
    fontSize: 25,
  },
});
