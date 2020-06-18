import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {CLIENT, ON_TRANSACTION_POST} from '../graphql';

const Screen = ({children, navigation, session, updateBalance}) => {
  const [getService, setService] = useState({});
  const [getCurrent, setCurrent] = useState('');

  useEffect(() => {
    if (session.user.id != getCurrent) {
      setCurrent(session.user.id);
      subscribe();
    }
  }, [session]);

  useEffect(() => {}, [getService]);

  const subscribe = () => {
    getTransactionFeed();
  };

  const getTransactionFeed = () => {
    const service = CLIENT.subscribe({
      query: ON_TRANSACTION_POST,
      variables: {
        userId: session.user.id,
      },
    }).subscribe({
      next({data}) {
        // Toast.show('Account balance updated.');
        updateBalance({
          balance: data.onTransactionPost.balance,
        });
      },
      error(err) {
        console.error('err', err);
      },
    });
    setService(service);
  };

  return <>{children}</>;
};

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  updateBalance: payload => dispatch({type: 'UPDATE_BALANCE', payload}),
});

export const SubscriptionProvider = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Screen);
