import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Platform, Dimensions, FlatList, Image, TouchableOpacity} from 'react-native';
import {HeaderBack, HeaderTitle, HeaderRight, Card} from '../../../../../Components';
import CustomIcon from '../../../../../Components/Icons';
import {AlertOverlay} from '../../../../../../components';
import {COLOR, FONT, FONT_SIZE} from '../../../../../../res/variables';
import {emptyFaveIcon, emptyCartIcon} from '../../../../../assets';
import SwipeableView from 'react-native-swipeable-view';

import {MessageModal} from '../../../../../Components';
import {Item, Store, RenderFooter} from './Components';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { EmptyList } from '../../components';

const Component = ({navigation, reduxStates: {myFavorites}, reduxActions: {updateMyFavorites}}) => {

  const [willDelete, setWillDelete] = useState(false);
  const [messageModalShown, setMessageModalShown] = useState(false);

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Favorites', '']} />,
    headerRight: () => (
      <HeaderRight
        hidden={!willDelete}
        label={willDelete ? 'Done' : ''}
        onPress={() => {
          setWillDelete(false);
        }}
      />
    ),
  });

  useEffect(() => {
    (async () => {
      updateMyFavorites('set', await JSON.parse(AsyncStorage.getItem("TOKTOK_MY_FAVORITES")));
    })();
  }, []);

  const DeleteButton = ({onPress}) => {
    return (
      <>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={1}
          style={{flex: 1, backgroundColor: '#F6841F', alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 14, color: '#fff'}}>Delete</Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderItem = ({item}) => {
    return (
      <>
        <Store data={item.shop} />
        {item.items.map((raw, i) => (
          <SwipeableView
            btnsArray={[
              {
                text: 'Delete',
                component: (
                  <DeleteButton
                    onPress={() => {
                      updateMyFavorites("delete", {shop: item.shop, item: raw})
                      setMessageModalShown(true);
                    }}
                  />
                ),
              },
            ]}>
            <Item
              key={i}
              data={raw}
              willDelete={willDelete}
              onHold={() => setWillDelete(true)}
              onChecked={(item) => {
                console.log(item);
              }}
            />
          </SwipeableView>
        ))}
        <View style={{height: 8, backgroundColor: '#F7F7FA'}} />
      </>
    );
  };

  return (
    <>
      <View style={{flex: 1, backgroundColor: 'white'}}>
      {myFavorites.length === 0 ? (
        <EmptyList
          image={{
            source: emptyFaveIcon,
            style: {width: 220, height: 220, resizeMode: 'cover'}
          }}
          title="Your favorites is empty."
        />
      ) : (
        <FlatList data={myFavorites} renderItem={renderItem} />
      )}
        
        {willDelete && (
          <RenderFooter
            onPressBuyNow={() => {
              setMessageModalShown(true);
            }}
          />
        )}
        {messageModalShown && (
          <MessageModal
            type="Success"
            isVisible={messageModalShown}
            setIsVisible={(val) => setMessageModalShown(val)}
            message="Item has been removed from your favorites."
          />
        )}
      </View>
    </>
  );
};

const mapStateToProps = (state) => ({
  reduxStates: {
    myFavorites: state.toktokMall.myFavorites,
  },
});

const mapDispatchToProps = (dispatch) => ({
  reduxActions: {
    updateMyFavorites: (action, payload) => {
      dispatch({type: 'TOKTOK_MY_FAVORITES', action, payload});
    },
  },
});

export const ToktokMallMyWishlist = connect(mapStateToProps, mapDispatchToProps)(Component);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
});
