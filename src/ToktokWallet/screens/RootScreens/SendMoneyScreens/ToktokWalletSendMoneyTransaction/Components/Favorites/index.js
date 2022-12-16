import React, {useContext} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
//COMPONENTS
import {FavoritesContext} from '../ContextProvider';
import {FavoriteDetails} from './FavoriteDetails';
import {LoadingIndicator} from 'toktokwallet/components';
//HELPER
import {moderateScale} from 'toktokwallet/helper';
//ASSETS
import {VectorIcon, ICON_SET} from 'src/revamp';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const Favorites = ({navigation, setFormData, setErrorMessages}) => {
  const {favorites, getFavoritesLoading, setFavoriteId, getFavorites} = useContext(FavoritesContext);

  const onRefreshHomeFavorite = () => {
    getFavorites();
    setFavoriteId(0);
  };

  const onSelectItem = item => {
    const {id, favoriteAccount} = item;
    const {mobileNumber, person} = favoriteAccount;
    setFavoriteId(id);
    setFormData(prev => ({
      ...prev,
      recipientMobileNo: mobileNumber.replace('+63', ''),
      recipientName: `${person.firstName} ${person.lastName[0]}.`,
      recipientId: favoriteAccount.id,
    }));
  };

  if (favorites.length === 0) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.shadowContainer}>
        <View style={styles.lineSeperator}>
          <Text style={[styles.title]}>Favorites</Text>
          {favorites.length > 5 && (
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={() =>
                navigation.navigate('ToktokWalletSendMoneyFavorites', {onSelectItem, onRefreshHomeFavorite})
              }>
              <Text style={[styles.seeAllText]}>See All</Text>
              <VectorIcon
                color={COLOR.ORANGE}
                size={moderateScale(15)}
                iconSet={ICON_SET.Entypo}
                name="chevron-right"
              />
            </TouchableOpacity>
          )}
        </View>
        {getFavoritesLoading ? (
          <LoadingIndicator isLoading={true} style={{marginVertical: moderateScale(30)}} size="small" />
        ) : (
          <FlatList
            data={favorites.slice(0, 5)}
            renderItem={({item}) => (
              <FavoriteDetails item={item} setFormData={setFormData} setErrorMessages={setErrorMessages} />
            )}
            keyExtractor={(item, index) => index}
            scrollEnabled={false}
            horizontal
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: moderateScale(16),
    marginHorizontal: moderateScale(16),
  },
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2,
    elevation: 3,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  flatlistContainer: {
    paddingVertical: moderateScale(15),
    flexGrow: 1,
  },
  title: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    color: COLOR.ORANGE,
  },
  lineSeperator: {
    borderWidth: 1,
    borderColor: '#C4C4C436',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(15),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  seeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
  },
  seeAllText: {
    fontSize: FONT_SIZE.M,
    color: COLOR.ORANGE,
  },
  favoriteContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  itemLogo: {
    height: moderateScale(45),
    width: moderateScale(45),
    borderRadius: moderateScale(45),
    resizeMode: 'contain',
  },
});
