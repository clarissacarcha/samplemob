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
import {BlackIcon, YellowIcon} from '../../../components/ui';
import {COLOR, DARK, LIGHT, MEDIUM, ORANGE, COLORS} from '../../../res/constants';
import {DELETE_SAVED_LOCATION, GET_SAVED_LOCATIONS} from '../../../graphql';
import {HeaderBack, HeaderTitle} from '../../../components';
import React, {useEffect, useState} from 'react';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {SavedLocation} from './Components';

import AddIcon from '../../../assets/icons/add-icon.png';
import NoData from '../../../assets/images/NoData.png';
import {connect} from 'react-redux';
import {onError} from '../../../util/ErrorUtility';

const imageWidth = Dimensions.get('window').width - 200;

const SavedLocations = ({navigation, session}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Saved', 'Address']} />,
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
    onCompleted: data => {
      getSavedLocations();
    },
  });

  const onSavedLocationAdded = newlyAddedLocation => {
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
          style={styles.submitBox}>
          <View style={styles.submit}>
            <Text style={styles.addLocText}>Add new Address</Text>
            <Image source={AddIcon} style={styles.addLocIcon} resizeMode={'contain'} />
          </View>
        </TouchableHighlight>
        <View style={styles.center}>
          <Image source={NoData} style={styles.image} resizeMode={'center'} />
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
        style={styles.submitBox}>
        <View style={styles.submit}>
          <Text style={styles.addLocText}>Add new Address</Text>
          <Image source={AddIcon} style={styles.addLocIcon} resizeMode={'contain'} />
        </View>
      </TouchableHighlight>
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={savedLocations}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            return <SavedLocation location={item} deleteSavedLocation={deleteSavedLocation} />;
          }}
        />
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export const ToktokSavedLocations = connect(mapStateToProps, mapDispatchToProps)(SavedLocations);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  submitBox: {
    borderRadius: 5,
    margin: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  submit: {
    padding: 16,
    backgroundColor: COLORS.WHITE,
    borderRadius: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  addLocText: {
    color: ORANGE,
    fontSize: 16,
  },
  addLocIcon: {
    width: 13,
    height: 13,
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
