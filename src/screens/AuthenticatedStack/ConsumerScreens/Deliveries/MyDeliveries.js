import React from 'react';
import _ from 'lodash';
import {View, Text, TouchableHighlight, ActivityIndicator, StyleSheet, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useQuery} from '@apollo/react-hooks';
import {GET_DELIVERIES_COUNT_BY_STATUS} from '../../../../graphql';
import {COLOR, DARK, MEDIUM, LIGHT} from '../../../../res/constants';
import {HeaderBack, HeaderTitle, SomethingWentWrong} from '../../../../components';

import FIcon from 'react-native-vector-icons/Feather';

const RoundedButton = ({label, data = {}}) => {
  const navigation = useNavigation();

  const {count, status} = data;
  const hasItems = count > 0;

  const onPress = () => navigation.push('SelectedDeliveries', {headerTitleLabel: label, status});

  return (
    <TouchableHighlight onPress={hasItems ? onPress : null} underlayColor={COLOR} style={styles.submitBox}>
      <View style={[styles.submit, {backgroundColor: count > 0 ? 'white' : LIGHT}]}>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              color: count > 0 ? DARK : MEDIUM,
              fontSize: 14,
              fontWeight: 'bold',
            }}>
            {`${label[0]} ${label[1]}`}
          </Text>
        </View>
        {hasItems && <FIcon name="chevron-right" size={18} color="white" style={styles.icon} />}
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

  useFocusEffect(() => {
    refetch();
  }, [session.user.id]);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={24} color={COLOR} />
      </View>
    );
  }

  if (error) {
    return <SomethingWentWrong />;
  }

  const mappedData = _.mapKeys(data.getDeliveriesCountByStatus, 'status');

  return (
    <ScrollView contentContainerStyle={{paddingTop: 10}} showsVerticalScrollIndicator={false}>
      <RoundedButton data={mappedData['1']} label={['Placed', 'Orders']} />
      <RoundedButton data={mappedData['2']} label={['Delivery', 'Scheduled']} />
      <RoundedButton data={mappedData['3']} label={['Driver on the Way', 'to Sender']} />
      <RoundedButton
        data={mappedData['4']}
        label={['Item', 'Picked Up']}
        // onPress={() => onPress({headerTitleLabel: ['Item', 'Picked Up']})}
      />
      <RoundedButton data={mappedData['5']} label={['Driver on the Way', 'to Recipient']} />
      <RoundedButton data={mappedData['6']} label={['Item', 'Delivered']} />
      <View style={{height: 100}} />
      <RoundedButton data={mappedData['7']} label={['Cancelled', 'Orders']} />
      <RoundedButton data={mappedData['9']} label={['Expired', 'Orders']} />
    </ScrollView>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

export default connect(
  mapStateToProps,
  null,
)(MyDeliveries);

const styles = StyleSheet.create({
  submitBox: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 5,
  },
  submit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
    paddingLeft: 10,
    // backgroundColor: LIGHT,
    height: 45,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    color: DARK,
    fontSize: 14,
    fontWeight: 'bold',
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
    backgroundColor: COLOR,
    borderRadius: 10,
    textAlignVertical: 'center',
    textAlign: 'center',
    marginLeft: 10,
  },
});
