import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {BlackIcon, YellowIcon} from '../../../../components/ui';
import {COLOR, DARK, LIGHT, MEDIUM, ORANGE} from '../../../../res/constants';
import {DELETE_SAVED_LOCATION, GET_SAVED_LOCATIONS} from '../../../../graphql';
import {HeaderBack, HeaderTitle} from '../../../../components';
import React, {useEffect, useState} from 'react';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';

import NoData from '../../../../assets/images/NoData.png';
import {connect} from 'react-redux';
import {onError} from '../../../../util/ErrorUtility';

const imageWidth = Dimensions.get('window').width - 200;

const SavedLocation = ({location, deleteSavedLocation}) => {
  return (
    <TouchableHighlight underlayColor={COLOR} style={{borderRadius: 10, marginHorizontal: 20, marginBottom: 20}}>
      <View style={styles.cardShadow}>
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', alignContent: 'center'}}>
            <YellowIcon set="FontAwesome5" name="pen" size={13} />
            <Text style={{marginLeft: 10, color: DARK, fontFamily: 'Rubik-Medium'}}>{location.name}</Text>
          </View>
          <View style={{height: 10}} />
          <View style={{flexDirection: 'row', alignContent: 'center'}}>
            <YellowIcon set="FontAwesome5" name="map-marker-alt" size={14} />
            <View style={{flex: 1, paddingHorizontal: 10}}>
              <Text style={{color: MEDIUM}}>{location.formattedAddress}</Text>
            </View>
          </View>
        </View>

        <View>
          <TouchableHighlight
            underlayColor={COLOR}
            onPress={() =>
              Alert.alert('', `Are you sure you want to delete ${location.name}?`, [
                {
                  text: 'Delete',
                  onPress: () =>
                    deleteSavedLocation({
                      variables: {
                        input: {
                          savedLocationId: location.id,
                        },
                      },
                    }),
                },
                {
                  text: 'Cancel',
                },
              ])
            }>
            <BlackIcon set="MaterialCommunity" name="delete" size={18} />
          </TouchableHighlight>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const SavedLocations = ({navigation, session}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Saved', 'Locations']} />,
  });

  const [savedLocations, setSavedLocations] = useState([]);

  const [getSavedLocations, {loading, error}] = useLazyQuery(GET_SAVED_LOCATIONS, {
    fetchPolicy: 'network-only',
    variables: {
      filter: {
        tokConsumerId: session.user.consumer.id,
      },
    },
    onCompleted: ({getSavedLocations}) => {
      setSavedLocations(getSavedLocations);
    },
  });

  const [deleteSavedLocation] = useMutation(DELETE_SAVED_LOCATION, {
    onError: onError,
    onCompleted: (data) => {
      getSavedLocations();
    },
  });

  const onSavedLocationAdded = (newlyAddedLocation) => {
    setSavedLocations([...savedLocations, newlyAddedLocation]);
  };

  useEffect(() => {
    getSavedLocations();
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={24} color={COLOR} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Something Went Wrong</Text>
      </View>
    );
  }

  if (savedLocations.length === 0) {
    return (
      <View style={{flex: 1}}>
        <TouchableHighlight
          onPress={() => {
            navigation.push('ToktokAddLocation', {onSavedLocationAdded});
          }}
          style={{borderRadius: 10, margin: 20, marginBottom: 0}}>
          <View style={styles.submit}>
            <Text style={{color: COLOR, fontSize: 16}}>Add Location</Text>
          </View>
        </TouchableHighlight>
        <View style={styles.center}>
          <Image source={NoData} style={styles.image} resizeMode={'contain'} />
        </View>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <TouchableHighlight
        onPress={() => {
          navigation.push('ToktokAddLocation', {onSavedLocationAdded});
        }}
        style={{borderRadius: 10, margin: 20, marginBottom: 0}}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 16}}>Add Location</Text>
        </View>
      </TouchableHighlight>
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={savedLocations}
          keyExtractor={(item) => item.id}
          renderItem={({item, index}) => {
            return <SavedLocation location={item} deleteSavedLocation={deleteSavedLocation} />;
          }}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

const mapDispatchToProps = (dispatch) => ({
  createSession: (payload) => dispatch({type: 'CREATE_SESSION', payload}),
});

export const ToktokSavedLocations = connect(mapStateToProps, mapDispatchToProps)(SavedLocations);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    // backgroundColor: 'white',
  },
  cardShadow: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

    flexDirection: 'row',
  },
  submitBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    margin: 20,
    borderRadius: 10,
  },
  submit: {
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: imageWidth,
    width: imageWidth,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
