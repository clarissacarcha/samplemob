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

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(150 + getStatusbarHeight) : moderateScale(145),
  bgImage: Platform.OS === 'android' ? moderateScale(115 + getStatusbarHeight) : moderateScale(125),
};

const ToktokFoodHome = () => {
  useUserLocation(); // user location hook

  const [viewHeight, setViewHeight] = useState(100);

  const getWindowDimension = (event) => {
    let height = event.nativeEvent.layout.height;
    setViewHeight(height);
  };

  useEffect(() => {
    async function getCart(){
      await clearTemporaryCart()
    }
    getCart()
  }, [])

  return (
    <View style={styles.container} onLayout={(event) => getWindowDimension(event)}>
      {/* <DraggableIcon data={transactions} title="Ongoing Orders" viewHeight={viewHeight} /> */}
      <HeaderImageBackground customSize={CUSTOM_HEADER}>
        <HeaderTitle showAddress={true} title="toktokfood" />
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
  },
});
