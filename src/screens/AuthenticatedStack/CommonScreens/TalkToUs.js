import React from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableHighlight, Linking, Dimensions, Image} from 'react-native';
import {connect} from 'react-redux';
import {COLOR, DARK, MEDIUM, LIGHT} from '../../../res/constants';
import {HeaderBack, HeaderTitle} from '../../../components';

import FAIcon from 'react-native-vector-icons/FontAwesome';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import Logo from '../../../assets/icons/ToktokLogo.png';

const imageWidth = Dimensions.get('window').width - 40;

const TalkToUs = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Talk', 'To Us']} />,
  });

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{paddingHorizontal: 20, paddingTop: 20, marginBottom: 0}}>
          <View
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,

              borderRadius: 50,
              overflow: 'hidden',
            }}
          />
          <Image
            source={Logo}
            style={{
              height: imageWidth,
              width: imageWidth,
              borderRadius: 50,
              marginBottom: 20,
            }}
          />
          <TouchableHighlight
            onPress={() => {
              Linking.openURL('http://www.youtube.com');
            }}
            underlayColor={COLOR}
            style={styles.card}>
            <View style={styles.taskBox}>
              {/*-------------------- VISIT OUR WEBSITE LABEL --------------------*/}
              <View style={styles.rowBox}>
                <View style={styles.row}>
                  <FAIcon name="info" size={16} color={'white'} style={styles.iconBox} />
                  <Text style={{fontSize: 14, marginLeft: 16, color: DARK, fontWeight: 'bold'}}>Visit our website</Text>
                </View>
              </View>

              {/*-------------------- WEBSITE --------------------*/}
              <View style={styles.rowBox}>
                <View style={styles.row}>
                  <MCIcon name="web" size={16} color={'white'} style={styles.iconBox} />
                  <Text style={{fontSize: 14, marginLeft: 16, color: MEDIUM, fontWeight: 'bold'}}>www.toktok.ph</Text>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        </View>

        <View style={{paddingHorizontal: 20, paddingTop: 20, marginBottom: 10}}>
          <TouchableHighlight
            onPress={() => {
              Linking.openURL(
                'mailto:support@toktok.ph?subject=Talk%20To%20Us&body=How%20can%20we%20help%20you%20ka-toktok?',
              );
            }}
            underlayColor={COLOR}
            style={styles.card}>
            <View style={styles.taskBox}>
              {/*-------------------- EMAIL US LABEL --------------------*/}
              <View style={styles.rowBox}>
                <View style={styles.row}>
                  <FAIcon name="info" size={16} color={'white'} style={styles.iconBox} />
                  <Text style={{fontSize: 14, marginLeft: 16, color: DARK, fontWeight: 'bold'}}>Email Us</Text>
                </View>
              </View>

              {/*-------------------- SUPPORT EMAIL --------------------*/}
              <View style={styles.rowBox}>
                <View style={styles.row}>
                  <MCIcon name="email" size={16} color={'white'} style={styles.iconBox} />
                  <Text style={{fontSize: 14, marginLeft: 16, color: MEDIUM, fontWeight: 'bold'}}>
                    support@toktok.ph
                  </Text>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TalkToUs);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBox: {
    height: 40,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: LIGHT,
    alignItems: 'center',
  },
  card: {
    borderRadius: 10,
  },
  taskBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingVertical: 10,
  },

  input: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 5,
    paddingLeft: 20,
  },
  label: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontWeight: 'bold',
  },

  iconBox: {
    backgroundColor: COLOR,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  iconBoxDark: {
    backgroundColor: DARK,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 20,
  },
});
