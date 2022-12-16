import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
//COMPONENTS
import {FavoritesContext} from '../ContextProvider';
//HELPER
import {moderateScale} from 'toktokwallet/helper';
//ASSETS
import {no_profile_contact} from 'toktokwallet/assets';
const {width} = Dimensions.get('screen');

export const FavoriteDetails = ({item, setFormData, setErrorMessages}) => {
  const {setFavoriteId} = useContext(FavoritesContext);
  const [imageError, setImageError] = useState(false);
  const {id, favoriteAccount} = item.node;
  const {selfieImage, firstName, lastName} = favoriteAccount.person;

  const onPressItem = () => {
    setFavoriteId(id);
    setFormData(prev => ({
      ...prev,
      recipientMobileNo: favoriteAccount.mobileNumber.replace('+63', ''),
      recipientName: `${firstName} ${lastName[0]}.`,
      recipientId: favoriteAccount.id,
    }));
    setErrorMessages(prev => ({...prev, recipientMobileNo: ''}));
  };

  return (
    <TouchableOpacity onPress={onPressItem}>
      <View style={styles.container}>
        <FastImage
          source={imageError ? no_profile_contact : {uri: selfieImage, priority: FastImage.priority.high}}
          style={styles.itemLogo}
          onError={() => setImageError(true)}
        />
        <Text style={styles.name} numberOfLines={2}>
          {firstName} {lastName[0]}.
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width / 5.45,
    alignItems: 'center',
    padding: moderateScale(10),
    marginVertical: moderateScale(10),
  },
  name: {
    textAlign: 'center',
    marginTop: moderateScale(7),
  },
  itemLogo: {
    height: moderateScale(45),
    width: moderateScale(45),
    borderRadius: moderateScale(45),
    resizeMode: 'contain',
  },
});
