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

import ToktokfoodComingSoonHead from '../../../../assets/images/ToktokfoodComingSoonHead.png';
import ToktokfoodComingSoonBody from '../../../../assets/images/ToktokfoodComingSoonBody.png';

const imageWidth = Dimensions.get('window').width;

const Screen = ({constants, navigation}) => {
  const pop = () => {
    navigation.pop();
  };

  const openLink = async () => {
    const result = await Linking.openURL(constants.toktokfoodComingSoonLink);

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
      <Image
        // source={ToktokfoodComingSoonHead}
        source={{
          uri: constants.toktokfoodComingSoonHeadImage,
        }}
        resizeMode="contain"
        style={{height: imageWidth, width: imageWidth - 80, marginTop: StatusBar.currentHeight}}
      />
      <View style={styles.body}>
        <Image
          // source={ToktokfoodComingSoonBody}
          source={{
            uri: constants.toktokfoodComingSoonBodyImage,
          }}
          resizeMode="contain"
          style={{...getDimensionsForWidth({imgWidth: 1243, imgHeight: 534, targetWidth: imageWidth - 80})}}
        />
        <View style={styles.buttonBox}>
          <TouchableOpacity style={styles.button} onPress={openLink}>
            <Text style={styles.text}>Sign Up Now</Text>
          </TouchableOpacity>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 15, fontFamily: 'FiraSans-Bold'}}>For more details, visit us at</Text>
          <Text style={{fontSize: 15, fontFamily: 'FiraSans-Bold', color: '#F38220'}}>toktokfood.ph</Text>
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
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
  },
  body: {
    flex: 1,
    marginHorizontal: 40,
    justifyContent: 'space-evenly',
  },
  buttonBox: {
    height: 90,
    justifyContent: 'center',
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
