import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, RefreshControl} from 'react-native';
import {HeaderBack, HeaderTitle, HeaderRight, Card, Loading} from '../../../../../Components';
import CustomIcon from '../../../../../Components/Icons';
import {AlertOverlay} from '../../../../../../components';
import {COLOR, FONT, FONT_SIZE} from '../../../../../../res/variables';
import {emptyFollowingIcon} from '../../../../../assets';
import {FlatList} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {EmptyList} from '../../components';

import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../../graphql';
import { GET_MY_FOLLOWING } from '../../../../../../graphql/toktokmall/model';
import AsyncStorage from '@react-native-community/async-storage';

const placeholderPNG = require('../../../../../../assets/images/toktokwallet.png');

const ListItem = ({updateMyFollowing, ...data}) => {
  const {profileImages, shopname} = data;
  const {navigate} = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigate('ToktokMallStore', {id: data?.id})}>
      <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 20}}>
        <View style={{flex: 0, alignItems: 'center', justifyContent: 'center'}}>
          <Image
            source={profileImages?.logo ? {uri: profileImages.logo} : placeholderPNG}
            style={{width: 35, height: 35, resizeMode: 'stretch', borderRadius: 35 / 2}}
          />
        </View>
        <View
          style={{flex: 9, marginLeft: 10, alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 6}}>
          <Text style={{fontSize: 14, fontFamily: FONT.REGULAR}}>{shopname}</Text>
        </View>
        <TouchableOpacity
          onPress={() => updateMyFollowing('unfollow', data)}
          style={{flex: 0, alignItems: 'flex-end', justifyContent: 'center'}}>
          <Text style={{fontSize: 12, color: '#F6841F'}}>Unfollow</Text>
        </TouchableOpacity>
      </View>
      <View style={{height: 2, backgroundColor: '#F7F7FA'}} />
    </TouchableOpacity>
  );
};

const Component = ({navigation, reduxStates: {myFollowing}, reduxActions: {updateMyFollowing}}) => {

  const [following, setFollowing] = useState([])

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Following', '']} />,
    headerRight: () => <HeaderRight hidden={true} />,
  });

  const [getMyFollowing, {error, loading}] = useLazyQuery(GET_MY_FOLLOWING, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      console.log(response)
      if(response.getMyFollowing){
        setFollowing(response.getMyFollowing)
      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const init = async () => {
    AsyncStorage.getItem("ToktokMallUser").then((raw) => {
      const data = JSON.parse(raw)
      if(data.userId){
        getMyFollowing({
          variables: {
            input: {
              userId: data.userId
            }
          }
        })
      }
    })
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <View style={{flex: 1}}>
      <View style={{height: 8, backgroundColor: '#F7F7FA'}} />

      {loading && 
        <View style={{flex: 1}}>
          <Loading state={loading} />
        </View>
      }      

      {!loading && following.length > 0 &&
        <FlatList
          style={styles.container}
          data={following}
          renderItem={({item}) => <ListItem {...{...item?.shop, updateMyFollowing}} />}
          refreshControl={
            <RefreshControl 
              refreshing={loading}
              onRefresh={() => init()}
            />
          }
        />
      }
      
      {!loading && following.length == 0 && 
        <EmptyList
          image={{
            source: emptyFollowingIcon,
            style: {width: 220, height: 220, resizeMode: 'cover'}
          }}
          title="You didn't follow any store yet."
        />
      }
      
    </View>
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
