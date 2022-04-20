import React from 'react';
import _ from 'lodash';
import {
  View,
  Text,
  TouchableHighlight,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import {throttle} from 'lodash';
import {useNavigation} from '@react-navigation/native';
import {useQuery} from '@apollo/react-hooks';
import {GET_DELIVERIES_COUNT_BY_STATUS} from '../../../../../graphql';
import {DARK} from '../../../../../res/constants';
import {FONT, COLOR, FONT_SIZE, SIZE} from '../../../../../res/variables';
import {VectorIcon, ICON_SET} from '../../../../../revamp';
import {HeaderBack, HeaderTitle, SomethingWentWrong} from '../../../../../components';

const RoundedButton = ({label, data = {}}) => {
  const navigation = useNavigation();

  const {count, status} = data;
  const hasItems = count > 0;

  const onPress = throttle(() => navigation.push('SelectedDeliveries', {headerTitleLabel: label, status}), 1000, {
    trailing: false,
  });

  return (
    <TouchableHighlight
      onPress={hasItems ? onPress : null}
      underlayColor={COLOR.WHITE_UNDERLAY}
      style={styles.submitBox}>
      <View style={[styles.submit]}>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              color: count > 0 ? COLOR.BLACK : COLOR.MEDIUM,
            }}>
            {`${label[0]} ${label[1]}`}
          </Text>
        </View>
        {hasItems && (
          <VectorIcon
            iconSet={ICON_SET.Entypo}
            name="chevron-thin-right"
            color={COLOR.BLACK}
            size={16}
            style={{marginRight: 2}}
          />
        )}
      </View>
    </TouchableHighlight>
  );
};

const MyDeliveries = ({navigation, session}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['My', 'Deliveries']} />,
  });

  const {data, loading, error, refetch} = useQuery(GET_DELIVERIES_COUNT_BY_STATUS, {
    fetchPolicy: 'network-only',
    variables: {
      filter: {
        tokConsumerId: session.user.consumer.id,
      },
    },
  });

  // useFocusEffect(() => {
  //   refetch();
  // }, [session.user.id]);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={24} color={COLOR.YELLOW} />
      </View>
    );
  }

  if (error) {
    return <SomethingWentWrong />;
  }

  const mappedData = _.mapKeys(data.getDeliveriesCountByStatus, 'status');

  return (
    <View style={styles.container}>
      {/* <View
        style={{
          backgroundColor: 'white',
          paddingTop: StatusBar.currentHeight,
          justifyContent: 'center',
          alignItems: 'center',
          height: Platform.select({android: 50 + StatusBar.currentHeight, ios: 50}),
          borderBottomWidth: 1,
          borderBottomColor: COLOR.LIGHT,
        }}></View> */}
      <View style={{marginHorizontal: SIZE.MARGIN, flexDirection: 'row', paddingVertical: 8}}>
        <VectorIcon iconSet={ICON_SET.Entypo} name="arrow-long-down" color={COLOR.MEDIUM} />
        <Text style={{color: COLOR.MEDIUM, marginLeft: SIZE.MARGIN / 2}}>Swipe down to refresh</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl onRefresh={refetch} refreshing={loading} colors={[COLOR.YELLOW]} />}>
        <RoundedButton data={mappedData['1']} label={['Placed', 'Orders']} />
        <RoundedButton data={mappedData['2']} label={['Scheduled', 'for Delivery']} />
        <RoundedButton data={mappedData['3']} label={['On the Way', 'to Sender']} />
        <RoundedButton data={mappedData['4']} label={['Item', 'Picked Up']} />
        <RoundedButton data={mappedData['5']} label={['On the Way', 'to Recipient']} />
        <RoundedButton data={mappedData['6']} label={['Item', 'Delivered']} />
        <View style={{height: SIZE.MARGIN / 2, backgroundColor: COLOR.LIGHT}} />
        <RoundedButton data={mappedData['7']} label={['Cancelled', 'Orders']} />
        <RoundedButton data={mappedData['9']} label={['Expired', 'Orders']} />
      </ScrollView>
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

export const ToktokLandingDeliveries = connect(mapStateToProps, null)(MyDeliveries);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  submitBox: {
    marginHorizontal: SIZE.MARGIN,
    borderRadius: 5,
  },
  submit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 2,
    paddingLeft: SIZE.MARGIN / 2,
    backgroundColor: COLOR.WHITE,
    height: 50,
    borderRadius: 5,
    alignItems: 'center',
  },
  text: {
    color: DARK,
    fontSize: 14,
    fontFamily: 'Rubik-Medium',
  },
  darkIcon: {
    height: 20,
    width: 20,
    backgroundColor: DARK,
    borderRadius: 10,
    textAlignVertical: 'center',
    textAlign: 'center',
    marginLeft: 10,
  },
  icon: {
    height: 20,
    width: 20,
    backgroundColor: COLOR.YELLOW,
    borderRadius: 10,
    textAlignVertical: 'center',
    textAlign: 'center',
    marginLeft: 10,
  },
});
