import React from 'react';
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity} from 'react-native';
import {HeaderBack, HeaderTitle, HeaderRight, Card} from '../../../../../Components';
import CustomIcon from '../../../../../Components/Icons';
import {AlertOverlay} from '../../../../../../components';
import {COLOR, FONT, FONT_SIZE} from '../../../../../../res/variables';
import {FlatList} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import { useNavigation } from '@react-navigation/native';
const placeholderPNG = require('../../../../../../assets/images/toktokwallet.png');

const ListItem = ({updateMyFollowing, ...data}) => {
    const {profileImages, shopname} = data
    const {navigate} = useNavigation()
  return (
    <TouchableOpacity onPress={() =>navigate("ToktokMallStore", {id: data?.id})}>
      <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 20}}>
        <View style={{flex: 0, alignItems: 'center', justifyContent: 'center'}}>
          <Image
            source={profileImages?.logo ? {uri: profileImages.logo} : placeholderPNG}
            style={{width: 35, height: 35, resizeMode: 'cover', borderRadius: 35 / 2}}
          />
        </View>
        <View style={{flex: 9,marginLeft: 10, alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 6}}>
          <Text style={{fontSize: 14, fontFamily: FONT.REGULAR}}>{shopname}</Text>
        </View>
        <TouchableOpacity onPress={() => updateMyFollowing('unfollow', data)} style={{flex: 0, alignItems: 'flex-end', justifyContent: 'center'}}>
          <Text style={{fontSize: 12, color: '#F6841F'}}>Unfollow</Text>
        </TouchableOpacity>
      </View>
      <View style={{height: 2, backgroundColor: '#F7F7FA'}} />
    </TouchableOpacity>
  );
};

const Component = ({navigation, reduxStates: {myFollowing}, reduxActions: {updateMyFollowing}}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Following', '']} />,
    headerRight: () => <HeaderRight hidden={true} />,
  });

  return (
    <>
      <FlatList style={styles.container} data={myFollowing} renderItem={({item}) => <ListItem {...{...item,updateMyFollowing}} />} />
    </>
  );
};

const mapStateToProps = (state) => ({
  reduxStates: {
    myFollowing: state.toktokMall.myFollowing,
  },
});

const mapDispatchToProps = (dispatch) => ({
  reduxActions: {
    updateMyFollowing: (action, payload) => {
      dispatch({type: 'TOKTOK_MY_FOLLOWING', action, payload});
    },
  },
});

export const ToktokMallMyFollowing = connect(mapStateToProps, mapDispatchToProps)(Component);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
});
