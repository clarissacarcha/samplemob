import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {COLOR, DARK, ORANGE, MEDIUM, LIGHT} from '../../../../res/constants';
import {HeaderBack, HeaderTitle} from '../../../../components';
import {YellowIcon} from '../../../../components/ui';
import {useQuery} from '@apollo/react-hooks';
import {GET_SAVED_LOCATIONS} from '../../../../graphql';

import NoData from '../../../../assets/images/NoData.png';
const imageWidth = Dimensions.get('window').width - 200;

const SavedLocation = ({location}) => {
  return (
    <TouchableHighlight
      // onPress={() => {}}
      underlayColor={COLOR}
      style={{borderRadius: 10, marginHorizontal: 20, marginBottom: 20}}>
      <View style={styles.cardShadow}>
        <View style={{flexDirection: 'row', alignContent: 'center'}}>
          <YellowIcon set="FontAwesome5" name="pen" size={13} />
          <Text style={{marginLeft: 10, color: DARK, fontFamily: 'Rubik-Medium'}}>{location.name}</Text>
        </View>
        <View style={{height: 10}} />
        <View style={{flexDirection: 'row', alignContent: 'center'}}>
          <YellowIcon set="FontAwesome5" name="map-marker-alt" size={14} />
          <Text style={{marginHorizontal: 10, color: MEDIUM}}>{location.formattedAddress}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const SavedLocations = ({navigation, route, session, createSession}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Saved', 'Locations']} />,
  });

  const [savedLocations, setSavedLocations] = useState([]);

  const {loading, error} = useQuery(GET_SAVED_LOCATIONS, {
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

  const onSavedLocationAdded = newlyAddedLocation => {
    setSavedLocations([...savedLocations, newlyAddedLocation]);
  };

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
            navigation.push('AddLocation', {onSavedLocationAdded});
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
          navigation.push('AddLocation', {onSavedLocationAdded});
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
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            // const lastItem = index == data.getAnnouncements.length - 1 ? true : false;

            return <SavedLocation location={item} />;
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SavedLocations);

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
