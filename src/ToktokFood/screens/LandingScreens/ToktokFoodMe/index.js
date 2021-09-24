import React, {useState, useEffect, useContext} from 'react';
import {Platform, StyleSheet, View, Image, Text, FlatList, TouchableOpacity} from 'react-native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

// Components
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderSearchBox from 'toktokfood/components/HeaderSearchBox';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import { clearTemporaryCart } from 'toktokfood/helper/TemporaryCart';

// Hooks
import {useUserLocation} from 'toktokfood/hooks';
import {useSelector} from 'react-redux';
import {moderateScale, getStatusbarHeight} from 'toktokfood/helper/scale';
import {arrow_right, help_centre_ic} from 'toktokfood/assets/images';

// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';
import { HelpCentre, Me, VerifyContext, VerifyContextProvider } from './components';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(70) + getStatusbarHeight : moderateScale(70),
  bgImage: Platform.OS === 'android' ? moderateScale(70) + getStatusbarHeight : moderateScale(70),
};

const DATA = [
  {
    title: "Help Centre",
    icon: ""
  }
]

const MainComponent = () => {

  const {location} = useSelector((state) => state.toktokFood);
  const {user} = useSelector((state) => state.session);
  const { showHelpCentreList, setShowHelpCentreList } = useContext(VerifyContext);


  const onBack = () => {
    setShowHelpCentreList(false)
  }

  return (
    <View style={styles.container}>
      <HeaderImageBackground styleContainer={{ justifyContent: 'center' }} customSize={CUSTOM_HEADER}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: getStatusbarHeight, paddingHorizontal: 16 }}>
          <TouchableOpacity onPress={onBack} style={{  }}>
            <FIcon5 name="chevron-left" size={15} />
          </TouchableOpacity>
          <View style={{ paddingHorizontal: 10  }}>
            <Image source={{ uri: user.person.avatar }} style={{ height: 50, width: 50, borderRadius: 50, resizeMode: 'cover' }} />
          </View>
          <Text style={{ fontSize: FONT_SIZE.L, fontFamily: FONT.BOLD }}>{`${user.person.firstName} ${user.person.lastName}`}</Text>
        </View>
      </HeaderImageBackground>
      <Me />
      <HelpCentre />
    </View>
  );
};

const ToktokFoodMe = () => {
  return (
    <VerifyContextProvider>
      <MainComponent />
    </VerifyContextProvider>
  );
};

export default ToktokFoodMe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
  },
  shadow: {
    backgroundColor:"whitesmoke",
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  boxContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  }
});
