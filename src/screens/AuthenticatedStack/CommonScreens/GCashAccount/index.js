import React, {useState, useEffect} from 'react';
import {Alert, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import {connect} from 'react-redux';

import {GET_GCASH_ACCOUNT, POST_GCASH_ACCOUNT, UPDATE_GCASH_ACCOUNT} from '../../../../graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../components';
import {onError} from '../../../../util/ErrorUtility';

import Loader from './Loader';
import Form from './Form';
import FormView from './FormView';

const GCashAccount = ({navigation, constants, session}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['GCash', 'Account']} />,
  });

  const [data, setData] = useState({getGCashAccount: {record: null}});

  const [getGCashAccount, {loading, error}] = useLazyQuery(GET_GCASH_ACCOUNT, {
    fetchPolicy: 'no-cache',
    variables: {
      input: {
        personId: session.user.person.id,
      },
    },
    onError: (e) => console.log(e),
    onCompleted: (res) => setData(res),
  });

  const [postGCashAccount, {loading: postLoading}] = useMutation(POST_GCASH_ACCOUNT, {
    onError,
    onCompleted: (res) => {
      Alert.alert('', res.postGCashAccount.message);
      getGCashAccount();
    },
  });

  const [updateGCashAccount, {loading: updateLoading}] = useMutation(UPDATE_GCASH_ACCOUNT, {
    onError,
    onCompleted: (res) => {
      Alert.alert('', res.updateGCashAccount.message);
      getGCashAccount();
    },
  });

  const onPostGCashAccount = (args) => {
    postGCashAccount({
      variables: {
        input: {
          ...args,
          personId: session.user.person.id,
        },
      },
    });
  };

  const onUpdateGCashAccount = (args) => {
    updateGCashAccount({
      variables: {
        input: {
          ...args,
          id: data.getGCashAccount.record.id,
        },
      },
    });
  };

  useEffect(() => {
    getGCashAccount();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Loader />;
  }

  if (!data.getGCashAccount.record) {
    return (
      <>
        <AlertOverlay visible={postLoading} />
        <Form onSubmit={onPostGCashAccount} />
      </>
    );
  }

  if (data.getGCashAccount.record.status === 0) {
    return <FormView data={data.getGCashAccount.record} status="Account Verification Pending" />;
  }

  if (data.getGCashAccount.record.status === 1) {
    return <FormView data={data.getGCashAccount.record} status="Account Verified" />;
  }

  if (data.getGCashAccount.record.status === 2) {
    return (
      <>
        <AlertOverlay visible={updateLoading} />
        <Form onSubmit={onUpdateGCashAccount} status="Previous account rejected, please update." />
      </>
    );
  }
};

const mapStateToProps = (state) => ({
  session: state.session,
  constants: state.constants,
});

export default connect(mapStateToProps, null)(GCashAccount);
