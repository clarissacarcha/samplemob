import React from 'react';
import {View, StyleSheet} from 'react-native';

// Components
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import {CategoryList} from './components';

// Hooks
import {useUserLocation} from 'toktokfood/hooks';

const ToktokFoodHome = () => {
  useUserLocation(); // user location hook

  return (
    <View style={styles.container}>
      <HeaderImageBackground>
        <HeaderTitle />
      </HeaderImageBackground>

      <CategoryList />
    </View>
  );
};

export default ToktokFoodHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
