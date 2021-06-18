import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';

// Components
import HeaderImageBackground from 'components/HeaderImageBackground';
import HeaderTitle from 'components/HeaderTitle';

// Helpers
import {getLocation} from 'toktokfood-helper';

const ToktokFoodHome = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Get user initial location
    getLocation().then((res) => dispatch({type: 'SET_TOKTOKFOOD_LOCATION', payload: res}));
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <HeaderImageBackground>
        <HeaderTitle />
      </HeaderImageBackground>
    </View>
  );
};

export default ToktokFoodHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
