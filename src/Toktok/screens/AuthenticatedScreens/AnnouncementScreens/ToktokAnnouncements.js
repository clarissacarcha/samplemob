import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {COLOR, DARK, LIGHT, MEDIUM, ORANGE} from '../../../../res/constants';
import {HeaderBack, HeaderTitle} from '../../../../components';
import React, {useState} from 'react';

import {APP_FLAVOR} from '../../../../res/constants';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {GET_ANNOUNCEMENTS} from '../../../../graphql';
import NoData from '../../../../assets/images/NoData.png';
import {YellowIcon} from '../../../../components/ui';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useQuery} from '@apollo/react-hooks';

const imageWidth = Dimensions.get('window').width - 200;

const Announcement = ({announcement, lastItem}) => {
  const {title, thumbnail, createdAt} = announcement;
  const navigation = useNavigation();
  return (
    <TouchableHighlight
      onPress={() => {
        navigation.push('ToktokSelectedAnnouncement', {announcement});
      }}
      underlayColor={COLOR}
      style={[styles.card, {marginBottom: lastItem ? 20 : 0}]}>
      <View style={styles.taskBox}>
        <View style={{flexDirection: 'row', height: 120}}>
          <Image source={{uri: thumbnail}} style={{height: 100, width: 100, margin: 10, borderRadius: 10}} />
          <View style={{flex: 1}}>
            {/*-------------------- TITLE --------------------*/}
            <View style={styles.rowBox}>
              <View style={styles.row}>
                <YellowIcon set="FontAwesome5" name="pen" size={14} />
                <Text
                  numberOfLines={4}
                  style={{
                    fontSize: 14,
                    color: DARK,
                    flex: 1,
                    paddingHorizontal: 10,
                    marginTop: 2,
                    fontFamily: 'Rubik-Medium',
                  }}>
                  {title}
                </Text>
              </View>
            </View>

            {/*-------------------- DATE --------------------*/}
            <View style={styles.rowBox}>
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
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
    // </View>
  );
};

const Announcements = ({navigation, route, session, createSession}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Announcements', '']} />,
  });

  const {data, loading, error} = useQuery(GET_ANNOUNCEMENTS, {
    fetchPolicy: 'network-only',
    variables: {
      filter: {
        appFlavor: APP_FLAVOR,
      },
    },
  });

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={24} color={COLOR} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Something Went Wrong</Text>
      </View>
    );
  }

  if (data.getAnnouncements.length === 0) {
    return (
      <View style={styles.center}>
        <Image source={NoData} style={styles.image} resizeMode={'contain'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data.getAnnouncements}
        keyExtractor={(item) => item.id}
        renderItem={({item, index}) => {
          const lastItem = index == data.getAnnouncements.length - 1 ? true : false;

          return <Announcement announcement={item} lastItem={lastItem} />;
        }}
      />
    </View>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

const mapDispatchToProps = (dispatch) => ({
  createSession: (payload) => dispatch({type: 'CREATE_SESSION', payload}),
});

export const ToktokAnnouncements = connect(mapStateToProps, mapDispatchToProps)(Announcements);

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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rowBox: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: LIGHT,
    alignItems: 'center',
  },
  card: {
    borderRadius: 10,
    margin: 20,
    marginBottom: 0,
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
    fontFamily: 'Rubik-Medium',
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
  image: {
    height: imageWidth,
    width: imageWidth,
  },
});
