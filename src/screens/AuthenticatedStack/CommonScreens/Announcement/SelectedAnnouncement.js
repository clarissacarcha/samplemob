import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator,
  Image,
  Linking,
  FlatList,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {COLOR, DARK, ORANGE, MEDIUM, LIGHT} from '../../../../res/constants';
import {HeaderBack, HeaderTitle} from '../../../../components';
import {YellowIcon} from '../../../../components/ui';
import {useQuery} from '@apollo/react-hooks';
import moment from 'moment';

import {GET_ANNOUNCEMENTS} from '../../../../graphql';

import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import EIcon from 'react-native-vector-icons/Entypo';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';

const Shadow = ({children}) => <View style={styles.shadow}>{children}</View>;

const imageWidth = Dimensions.get('window').width - 40;

const SelectedAnnouncement = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Announcement', '']} />,
  });

  const {announcement} = route.params;
  const {title, body, createdAt, image} = announcement;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Shadow>
          <Image source={{uri: image}} style={{height: imageWidth, width: imageWidth}} resizeMode="cover" />

          {/*-------------------- TITLE --------------------*/}
          <View style={styles.row}>
            <YellowIcon set="FontAwesome5" name="pen" size={14} />
            <Text
              numberOfLines={4}
              style={{
                fontSize: 14,
                color: DARK,
                flex: 1,
                paddingHorizontal: 10,
                fontWeight: 'bold',
                marginTop: 2,
              }}>
              {title}
            </Text>
          </View>

          {/*-------------------- DATE --------------------*/}
          <View style={styles.row}>
            <YellowIcon set="FontAwesome" name="calendar" />
            <Text
              style={{
                fontSize: 12,
                marginLeft: 10,
                color: MEDIUM,
                flex: 1,
                alignSelf: 'center',
              }}>
              {createdAt}
            </Text>
          </View>

          {/*-------------------- DATE --------------------*/}
          <View style={{paddingHorizontal: 20, paddingBottom: 20}}>
            <Text
              style={{
                fontSize: 12,
                color: DARK,
                alignSelf: 'center',
              }}>
              {body}
            </Text>
          </View>
        </Shadow>
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
)(SelectedAnnouncement);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  shadow: {
    overflow: 'hidden',
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
    margin: 20,
  },
  iconBox: {
    backgroundColor: COLOR,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
