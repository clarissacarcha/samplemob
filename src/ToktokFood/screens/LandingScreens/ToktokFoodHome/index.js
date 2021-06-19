import React from 'react';
import {View, StyleSheet} from 'react-native';

// Components
import HeaderImageBackground from 'components/HeaderImageBackground';
import HeaderTitle from 'components/HeaderTitle';

// Hooks
import {useUserLocation} from 'toktokfood-hooks';

const ToktokFoodHome = () => {
  useUserLocation(); // user location hook

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
