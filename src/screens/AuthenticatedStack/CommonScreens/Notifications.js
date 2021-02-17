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
import moment from 'moment';
import 'moment-timezone';
import {COLOR, DARK, ORANGE, MEDIUM, LIGHT, APP_FLAVOR} from '../../../res/constants';
import {HeaderBack, HeaderTitle} from '../../../components';
import {YellowIcon} from '../../../components/ui';
import {useQuery} from '@apollo/react-hooks';
import {useNavigation} from '@react-navigation/native';

import {GET_NOTIFICATIONS} from '../../../graphql';

import NoData from '../../../assets/images/NoData.png';

const imageWidth = Dimensions.get('window').width - 200;

import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationCard = ({message, lastItem}) => {
  const {title, body, type, payload, delivery, createdAt} = message;
  const navigation = useNavigation();

  const pushConsumerRoute = () => navigation.push('SelectedDelivery', {delivery});
  const pushDriverRoute = () => navigation.push('SelectedDriverDelivery', {delivery, label: ['Delivery', 'Details']});

  const pushRoute = APP_FLAVOR == 'C' ? pushConsumerRoute : pushDriverRoute;

  const onNotificationSelect = () => {
    if (delivery) {
      pushRoute();
      return;
    }

    if (type == 'W') {
      navigation.push('DriverWalletLog');
      return;
    }
  };

  return (
    <TouchableHighlight
      onPress={onNotificationSelect}
      underlayColor={COLOR}
      style={StyleSheet.flatten([styles.card, lastItem ? {marginBottom: 20} : null])}>
      <View style={styles.taskBox}>
        <View style={{flexDirection: 'row', marginHorizontal: 20, marginVertical: 10}}>
          <View style={{flex: 1}}>
            {/*-------------------- TITLE --------------------*/}
            <View style={styles.rowBox}>
              <View style={styles.row}>
                <YellowIcon set="FontAwesome5" name="exclamation" />
                <Text
                  numberOfLines={4}
                  style={{
                    fontSize: 12,
                    color: DARK,
                    flex: 1,
                    paddingHorizontal: 10,
                    marginTop: 2,
                    fontFamily: 'Rubik-Medium',
                  }}>
                  {title}
                </Text>
              </View>
              <View style={styles.row}>
                <YellowIcon set="FontAwesome" name="calendar" />
                <Text
                  style={{
                    fontSize: 11,
                    color: MEDIUM,
                    flex: 1,
                    paddingHorizontal: 10,
                    marginTop: 2,
                    fontFamily: 'Rubik-Medium',
                  }}>
                  {createdAt}
                </Text>
              </View>
            </View>

            {/*-------------------- DATE --------------------*/}
            <View style={styles.rowBox}>
              <View style={styles.rowMessage}>
                <YellowIcon set="MaterialCommunity" name="email" />

                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 10,
                    color: MEDIUM,
                    flex: 1,
                    alignSelf: 'center',
                  }}>
                  {body}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const Notifications = ({navigation, route, session, createSession}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Notifications', '']} />,
  });

  const {data, loading, error} = useQuery(GET_NOTIFICATIONS, {
    fetchPolicy: 'network-only',
    variables: {
      input: {
        userId: session.user.id,
      },
    },
    onError: (error) => {
      console.log(JSON.stringify(error, null, 4));
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

  if (data.getNotifications.length === 0) {
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
        data={data.getNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({item, index}) => {
          const lastItem = index == data.getNotifications.length - 1 ? true : false;

          return <NotificationCard message={item} lastItem={lastItem} />;
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

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);

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
    alignItems: 'center',
  },
  rowMessage: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rowBox: {
    marginVertical: 5,
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
