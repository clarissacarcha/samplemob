/**
 * @format
 * @flow
 */

import React from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderSearchBox from 'toktokfood/components/HeaderSearchBox';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
// Hooks
import {useUserLocation} from 'toktokfood/hooks';

// Components
import {StickyView} from './components';

const ToktokFoodHome = (): React$Node => {
  useUserLocation(); // user location hook
  // const [viewHeight, setViewHeight] = useState(100);

  const getWindowDimension = event => {
    // StatusBar.setHidden(false, 'slide');
    let height = event.nativeEvent.layout.height;
    // setViewHeight(height);
  };

  return (
    <View style={styles.container} onLayout={event => getWindowDimension(event)}>
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
    backgroundColor: 'white',
  },
});
