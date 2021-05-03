import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator,
  Image,
  StatusBar,
  FlatList,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import 'moment-timezone';
import {LIGHT, APP_FLAVOR, FONT_MEDIUM} from '../../../../res/constants';
import {FONT, COLOR, FONT_SIZE, SIZE} from '../../../../res/variables';
import {HeaderBack, HeaderTitle} from '../../../../components';
import {Shadow, VectorIcon, ICON_SET} from '../../../../revamp';
import {useQuery} from '@apollo/react-hooks';
import {useNavigation} from '@react-navigation/native';

import {GET_NOTIFICATIONS} from '../../../../graphql';

import NoData from '../../../../assets/images/NoData.png';

const imageWidth = Dimensions.get('window').width - 200;

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
    <TouchableHighlight onPress={onNotificationSelect} underlayColor={COLOR.WHITE_UNDERLAY} style={styles.touchable}>
      <View
        style={{height: 70, justifyContent: 'center', backgroundColor: COLOR.WHITE, paddingHorizontal: SIZE.MARGIN}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              height: 22,
              width: 22,
              backgroundColor: COLOR.ORANGE,
              borderRadius: 11,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <VectorIcon iconSet={ICON_SET.Octicons} name="mail" color={COLOR.WHITE} size={14} />
          </View>
          <View style={{marginHorizontal: SIZE.MARGIN}}>
            <Text numberOfLines={1}>{title}</Text>
            <Text
              numberOfLines={1}
              style={{
                color: COLOR.DARK,
              }}>
              {body}
            </Text>
          </View>
          {/*             
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
           */}
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
      <View style={styles.container}>
        <Shadow style={{borderRadius: 0}}>
          <View
            style={{
              height: 50 + StatusBar.currentHeight,
              backgroundColor: 'white',
              paddingTop: StatusBar.currentHeight,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: FONT_SIZE.L, fontFamily: FONT.BOLD}}>Notifications</Text>
          </View>
        </Shadow>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={COLOR.YELLOW} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Shadow style={{borderRadius: 0}}>
          <View
            style={{
              height: 50 + StatusBar.currentHeight,
              backgroundColor: 'white',
              paddingTop: StatusBar.currentHeight,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: FONT_SIZE.L, fontFamily: FONT.BOLD}}>Notifications</Text>
          </View>
        </Shadow>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Something Went Wrong</Text>
        </View>
      </View>
    );
  }

  if (data.getNotifications.length === 0) {
    return (
      <View style={styles.container}>
        <Shadow style={{borderRadius: 0}}>
          <View
            style={{
              height: 50 + StatusBar.currentHeight,
              backgroundColor: 'white',
              paddingTop: StatusBar.currentHeight,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: FONT_SIZE.L, fontFamily: FONT.BOLD}}>Notifications</Text>
          </View>
        </Shadow>
        <View style={styles.center}>
          <Image source={NoData} style={styles.image} resizeMode={'contain'} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Shadow style={{borderRadius: 0}}>
        <View
          style={{
            height: 50 + StatusBar.currentHeight,
            backgroundColor: 'white',
            paddingTop: StatusBar.currentHeight,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: FONT_SIZE.L, fontFamily: FONT.BOLD}}>Notifications</Text>
        </View>
      </Shadow>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data.getNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({item, index}) => {
          const lastItem = index == data.getNotifications.length - 1 ? true : false;

          return <NotificationCard message={item} lastItem={lastItem} />;
        }}
        ItemSeparatorComponent={() => (
          <View style={{borderBottomWidth: 1, marginHorizontal: SIZE.MARGIN, borderColor: COLOR.LIGHT}} />
        )}
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
  touchable: {
    borderRadius: 5,
    marginHorizontal: SIZE.MARGIN,
  },

  image: {
    height: imageWidth,
    width: imageWidth,
  },
});
