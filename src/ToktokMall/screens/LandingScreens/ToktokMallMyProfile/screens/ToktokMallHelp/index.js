import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {HeaderBack, HeaderTitle, HeaderRight, Card} from '../../../../../Components';
import CustomIcon from '../../../../../Components/Icons';
import {AlertOverlay} from '../../../../../../components';
import {COLOR, FONT, FONT_SIZE} from '../../../../../../res/variables';
import AIcons from 'react-native-vector-icons/dist/AntDesign'
import {throttle, debounce} from 'lodash'

export const ToktokMallHelp = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Help Centre', '']} />,
    headerRight: () => <HeaderRight hidden={true} />,
  });

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity  onPress = {() => {
          debounce(() => navigation.push('ToktokMallSecurity'))()
        }} style = {styles.row}>
          <Text style = {{fontFamily: FONT.REGULAR, fontSize: 14}}>Security and Privacy</Text>
          <AIcons 
            name = {'right'}
            color = {COLOR.ORANGE}
            size = {17}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress = {() => {
          debounce(() => navigation.push('ToktokMallTermsAndConditions'))()
        }} style = {styles.row}>
          <Text style = {{fontFamily: FONT.REGULAR, fontSize: 14}}>Terms and Conditions</Text>
          <AIcons 
            name = {'right'}
            color = {COLOR.ORANGE}
            size = {17}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress = {() => {
          debounce(() => navigation.push('ToktokMallContactUs'))()
        }} style = {styles.row}>
          <Text style = {{fontFamily: FONT.REGULAR, fontSize: 14}}>Contact Us</Text>
          <AIcons 
            name = {'right'}
            color = {COLOR.ORANGE}
            size = {17}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomColor: '#F4F4F4',
    borderBottomWidth: 1
  }
});
