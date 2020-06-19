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
import {COLOR, DARK, ORANGE, MEDIUM, LIGHT} from '../../../res/constants';
import {HeaderBack, HeaderTitle} from '../../../components';
import {useQuery} from '@apollo/react-hooks';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

import {GET_ANNOUNCEMENTS} from '../../../graphql';

const imageWidth = Dimensions.get('window').width - 40;

import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const MessageCard = ({announcement, lastItem}) => {
  const {title, thumbnail, createdAt} = announcement;
  const navigation = useNavigation();
  return (
    <TouchableHighlight
      onPress={() => {
        navigation.push('SelectedAnnouncement', {announcement});
      }}
      underlayColor={COLOR}
      style={styles.card}>
      <View style={styles.taskBox}>
        <View style={{flexDirection: 'row', marginHorizontal: 20, marginVertical: 10}}>
          <View style={{flex: 1}}>
            {/*-------------------- TITLE --------------------*/}
            <View style={styles.rowBox}>
              <View style={styles.row}>
                <FA5Icon name="pen" size={14} color={'white'} style={styles.iconBox} />
                <Text
                  numberOfLines={4}
                  style={{
                    fontSize: 14,
                    color: DARK,
                    flex: 1,
                    paddingHorizontal: 10,
                    marginTop: 2,
                    fontWeight: 'bold',
                  }}>
                  TITLE
                </Text>
              </View>
            </View>

            {/*-------------------- DATE --------------------*/}
            <View style={styles.rowBox}>
              <View style={styles.row}>
                <FAIcon name="calendar" size={16} color={'white'} style={styles.iconBox} />
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 10,
                    color: MEDIUM,
                    flex: 1,
                    alignSelf: 'center',
                  }}>
                  {/* {moment.unix(createdAt / 1000).format('MMM DD YYYY - h:mm a')} */}
                  DATE
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const Announcements = ({navigation, route, session, createSession}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Inbox', '']} />,
  });

  const {data, loading, error} = useQuery(GET_ANNOUNCEMENTS, {
    fetchPolicy: 'network-only',
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

  // if (data.getAnnouncements.length === 0) {
  //   return (
  //     <View style={styles.center}>
  //       <Text style={styles.text}>Nothing Found</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      {/* <FlatList
        showsVerticalScrollIndicator={false}
        data={data.getAnnouncements}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => {
          const lastItem = index == data.getAnnouncements.length - 1 ? true : false;

          return <Announcement announcement={item} lastItem={lastItem} />;
        }}
      /> */}
      <TouchableHighlight
        onPress={() => {
          navigation.push('SelectedAnnouncement', {announcement});
        }}
        underlayColor={COLOR}
        style={styles.card}>
        <View style={styles.taskBox}>
          <View style={{flexDirection: 'row', marginHorizontal: 20, marginVertical: 10}}>
            <View style={{flex: 1}}>
              {/*-------------------- TITLE --------------------*/}
              <View style={styles.rowBox}>
                <View style={styles.row}>
                  <FA5Icon name="exclamation" size={14} color={'white'} style={styles.iconBox} />
                  <Text
                    numberOfLines={4}
                    style={{
                      fontSize: 12,
                      color: DARK,
                      flex: 1,
                      paddingHorizontal: 10,
                      marginTop: 2,
                      fontWeight: 'bold',
                    }}>
                    Driver on the Way to Sender
                  </Text>
                </View>
                <View style={styles.row}>
                  <FAIcon name="calendar" size={16} color={'white'} style={styles.iconBox} />

                  <Text
                    style={{
                      fontSize: 12,
                      color: MEDIUM,
                      flex: 1,
                      paddingHorizontal: 10,
                      marginTop: 2,
                      fontWeight: 'bold',
                    }}>
                    Today - 10:49 pm
                  </Text>
                </View>
              </View>

              {/*-------------------- DATE --------------------*/}
              <View style={styles.rowBox}>
                <View style={styles.row}>
                  <MCIcon name="email" size={16} color={'white'} style={styles.iconBox} />
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 12,
                      marginLeft: 10,
                      color: MEDIUM,
                      flex: 1,
                      alignSelf: 'center',
                    }}>
                    {/* {moment.unix(createdAt / 1000).format('MMM DD YYYY - h:mm a')} */}
                    Your rider is on the way to pick up the item for your delivery with a reference
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>

      <TouchableHighlight
        onPress={() => {
          navigation.push('SelectedAnnouncement', {announcement});
        }}
        underlayColor={COLOR}
        style={styles.card}>
        <View style={styles.taskBox}>
          <View style={{flexDirection: 'row', marginHorizontal: 20, marginVertical: 10}}>
            <View style={{flex: 1}}>
              {/*-------------------- TITLE --------------------*/}
              <View style={styles.rowBox}>
                <View style={styles.row}>
                  <FA5Icon name="exclamation" size={14} color={'white'} style={styles.iconBox} />
                  <Text
                    numberOfLines={4}
                    style={{
                      fontSize: 12,
                      color: DARK,
                      flex: 1,
                      paddingHorizontal: 10,
                      marginTop: 2,
                      fontWeight: 'bold',
                    }}>
                    Delivery Scheduled
                  </Text>
                </View>
                <View style={styles.row}>
                  <FAIcon name="calendar" size={16} color={'white'} style={styles.iconBox} />

                  <Text
                    numberOfLines={4}
                    style={{
                      fontSize: 12,
                      color: MEDIUM,
                      flex: 1,
                      paddingHorizontal: 10,
                      marginTop: 2,
                      fontWeight: 'bold',
                    }}>
                    Today - 10:48 pm
                  </Text>
                </View>
              </View>

              {/*-------------------- DATE --------------------*/}
              <View style={styles.rowBox}>
                <View style={styles.rowMessage}>
                  <MCIcon name="email" size={16} color={'white'} style={styles.iconBox} />
                  <Text
                    // numberOfLines={2}
                    style={{
                      fontSize: 12,
                      marginLeft: 10,
                      color: MEDIUM,
                      flex: 1,
                      alignSelf: 'center',
                    }}>
                    {/* {moment.unix(createdAt / 1000).format('MMM DD YYYY - h:mm a')} */}
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae soluta dicta autem. Vitae fugit iusto
                    molestias optio voluptas accusamus porro et aperiam! Nobis ducimus itaque vero harum, saepe
                    similique aut. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum exercitationem, at
                    culpa, maxime omnis iste sapiente magnam ipsum, sint eligendi dicta ex assumenda recusandae soluta!
                    Cupiditate tempora iste veniam laborum!
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
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
)(Announcements);

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
