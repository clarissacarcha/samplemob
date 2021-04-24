import React from 'react';
import {
  View,
  Text,
  useWindowDimensions,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  StyleSheet,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {COLORS, FONTS, SIZES} from '../../../../../res/constants';
import {WhiteButton} from '../../../../../revamp';

import SMIcon from '../../../../../assets/toktok/dummy/SM.png';

const MenuIcon = ({label, icon, onPress}) => {
  return (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <View style={styles.menuIconBox}>
        <Image style={styles.menuIcon} source={icon} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const NEARBY_DATA = [
  {label: 'One'},
  {label: 'Two'},
  {label: 'Three'},
  {label: 'Four'},
  {label: 'Five'},
  {label: 'Six'},
  {label: 'Seven'},
  {label: 'Eight'},
  {label: 'Nine'},
  {label: 'Ten'},
];

const renderNearBy = ({item, index}) => {
  return (
    <TouchableHighlight
      onPress={() => {}}
      style={{height: 50, justifyContent: 'center', marginHorizontal: 10, borderRadius: 5, paddingHorizontal: 10}}
      underlayColor={COLORS.LIGHT_YELLOW}>
      <View>
        <Text style={{fontFamily: FONTS.REGULAR}}>{item.label}</Text>
      </View>
    </TouchableHighlight>
  );
};

const FirstRoute = () => (
  <View style={{flex: 1, backgroundColor: COLORS.WHITE}}>
    <FlatList data={NEARBY_DATA} renderItem={renderNearBy} showsVerticalScrollIndicator={false} />
  </View>
);

const SecondRoute = () => (
  <View style={{flex: 1, backgroundColor: COLORS.WHITE}}>
    <FlatList data={NEARBY_DATA} renderItem={renderNearBy} showsVerticalScrollIndicator={false} />
  </View>
);
const ThirdRoute = () => (
  <View style={{flex: 1, backgroundColor: COLORS.WHITE}}>
    <FlatList data={NEARBY_DATA} renderItem={renderNearBy} showsVerticalScrollIndicator={false} />
  </View>
);

const Pabili = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'All'},
    {key: 'second', title: 'Grocery'},
    {key: 'third', title: 'Pharmacy'},
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });

  const renderTabBarButton = () => (
    <View>
      <Text>LALA</Text>
    </View>
  );

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: COLORS.YELLOW}}
      style={{backgroundColor: 'white'}}
      renderLabel={({route, focused, color}) => (
        <Text style={{fontFamily: FONTS.REGULAR, fontSize: SIZES.M}}>{route.title} (10)</Text>
      )}
    />
  );

  return (
    <>
      <View
        style={{
          height: 100,
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <MenuIcon label={'SM Supermalls'} icon={SMIcon} onPress={() => {}} />
        <MenuIcon label={'SM Supermalls'} icon={SMIcon} onPress={() => {}} />
        <MenuIcon label={'SM Supermalls'} icon={SMIcon} onPress={() => {}} />
        <MenuIcon label={'SM Supermalls'} icon={SMIcon} onPress={() => {}} />
      </View>
      <View style={{height: 150, justifyContent: 'space-evenly', paddingHorizontal: 10}}>
        <WhiteButton onPress={() => {}} />
        <WhiteButton onPress={() => {}} />
      </View>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={renderTabBar}
        render
      />
    </>
  );
};

export default Pabili;

const styles = StyleSheet.create({
  menuBox: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.REGULAR,
  },
  menuIconBox: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  menuIcon: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
  },
});
