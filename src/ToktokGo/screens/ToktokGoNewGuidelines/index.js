import React from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StatusBar,
} from 'react-native';
import GradientBackground from '../../../assets/toktokgo/toktokgo-gradient-background.png';
import Graphics from '../../../assets/toktokgo/toktokgo-health-care-graphics.png';
import ToktokGoFrame from '../../../assets/toktokgo/ToktokGoFrame.png';
import NewGuidelines from '../../../assets/toktokgo/NewGuidelines.png';
import ArrowLeft from '../../../assets/icons/arrow-left-icon.png';
import constants from '../../../common/res/constants';
import CONSTANTS from '../../../common/res/constants';
import FAIcons from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import normalize from 'react-native-normalize';
const windowWidth = Dimensions.get('window').width;
const ToktokGoNewGuidelines = ({navigation, route}) => {
  const {voucherData} = route.params;
  const onPress = () => {
    navigation.replace('ToktokGoBookingStart', {voucherData});
  };
  const ItemSeperatorView = () => {
    return <View style={styles.itemSeperatorStyle} />;
  };
  return (
    <ImageBackground source={GradientBackground} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container1}>
          <TouchableOpacity style={{paddingLeft: 18}} onPress={() => navigation.pop()}>
            <Image style={{height: 15, width: 10}} source={ArrowLeft} resizeMode={'contain'} />
          </TouchableOpacity>
        </View>

        <View style={styles.container2}>
          <Image source={ToktokGoFrame} style={styles.goFrameStyle} resizeMode="contain" />
          <View style={styles.container3}>
            <Image source={NewGuidelines} style={styles.goNewGuidelinesStyle} resizeMode="contain" />
            <View style={styles.container4}>
              <Text style={styles.smalFontSize}>
                The new fare shall be imposed as per the LTFRB’s recent guidelines regarding an increase in the flagdown
                rate for all TNVS and Taxi units.
              </Text>
            </View>
            <View style={styles.container5}>
              <Text style={styles.smalFontSize}>
                The increase of
                <Text style={styles.fontOrangeSemiBold}> ₱5.00</Text> shall be effective starting this{' '}
                <Text style={styles.fontBlackSemiBold}>October 3, 2022.</Text> See the new flagdown rate below:
              </Text>
            </View>
            <View style={styles.container6}>
              <View style={styles.container7}>
                <Text>Sedan</Text>
                <Text style={styles.fontOrangeSemiBold}>₱45.00 </Text>
              </View>
              <ItemSeperatorView />
              <View style={styles.container7}>
                <Text>MPV or Larger</Text>
                <Text style={styles.fontOrangeSemiBold}>₱55.00 </Text>
              </View>
              <ItemSeperatorView />
              <View style={styles.container7}>
                <Text>Hatchback/Sub-compact</Text>
                <Text style={styles.fontOrangeSemiBold}>₱35.00 </Text>
              </View>
            </View>
            <View style={styles.container8}>
              <Text style={styles.smalFontSize}>
                This notice is given to all our customers and drivers ahead of schedule in order for us to prepare and
                amend the rates.
              </Text>
            </View>
            <View style={styles.container9}>
              <Text style={styles.smalFontSize}>Take note that this will be implemented starting October 3, 2022.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.fabcontainer}>
        <TouchableOpacity style={styles.fab} onPress={onPress}>
          <Text style={styles.fabtext}>OK</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default ToktokGoNewGuidelines;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container1: {
    marginTop: StatusBar.currentHeight + 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container2: {
    alignItems: 'center',
    bottom: 50,
  },
  container3: {
    bottom: 80,
    alignItems: 'center',
  },
  container4: {
    width: windowWidth * 0.85,
    bottom: 40,
  },
  container5: {
    width: windowWidth * 0.85,
    bottom: 30,
  },
  container6: {
    width: windowWidth * 0.85,
    bottom: 15,
    backgroundColor: '#FFFCF4',
    height: 120,
  },
  container7: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: 10,
  },
  container8: {
    width: windowWidth * 0.85,
  },
  container9: {
    width: windowWidth * 0.85,
    marginTop: 10,
  },
  goFrameStyle: {
    height: normalize(150),
    width: normalize(150),
  },
  goNewGuidelinesStyle: {
    height: normalize(300),
    width: normalize(300),
  },
  smalFontSize: {
    fontSize: normalize(13.5),
  },
  fontOrangeSemiBold: {
    color: CONSTANTS.COLOR.ORANGE,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
  },
  fontBlackSemiBold: {
    color: CONSTANTS.COLOR.BLACK,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
  },
  fabcontainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: constants.COLOR.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 32,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    shadowOpacity: 0.2,
    elevation: 5,
    borderTopColor: '#F8F8F8',
    borderTopWidth: 2,
  },
  fab: {
    backgroundColor: constants.COLOR.ORANGE,
    borderRadius: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 11,
  },
  fabtext: {
    color: constants.COLOR.WHITE,
    fontFamily: constants.FONT_FAMILY.BOLD,
    fontSize: constants.FONT_SIZE.L,
  },
  itemSeperatorStyle: {
    // height: 0.5,
    width: '90%',
    // backgroundColor: "#E4E4E4",
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: '#E4E4E4',
    marginLeft: 15,
  },
});
