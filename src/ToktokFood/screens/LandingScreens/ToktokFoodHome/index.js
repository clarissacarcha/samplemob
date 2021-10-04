import React, {useState, useEffect} from 'react';
import {Platform, StyleSheet, View} from 'react-native';

// Components
import {StickyView} from './components';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderSearchBox from 'toktokfood/components/HeaderSearchBox';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import { clearTemporaryCart } from 'toktokfood/helper/TemporaryCart';

// Hooks
import {useUserLocation} from 'toktokfood/hooks';

import {moderateScale, getStatusbarHeight} from 'toktokfood/helper/scale';

const ToktokFoodHome = () => {
  useUserLocation(); // user location hook
  const [viewHeight, setViewHeight] = useState(100);

  const getWindowDimension = (event) => {
    let height = event.nativeEvent.layout.height;
    setViewHeight(height);
  };

  return (
    <View style={styles.container} onLayout={(event) => getWindowDimension(event)}>
      {/* <DraggableIcon data={transactions} title="Ongoing Orders" viewHeight={viewHeight} /> */}
      <HeaderImageBackground>
        <HeaderTitle isHome />
        <HeaderSearchBox />
      </HeaderImageBackground>
      <StickyView />
    </View>
  );
};

export default ToktokFoodHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
});
