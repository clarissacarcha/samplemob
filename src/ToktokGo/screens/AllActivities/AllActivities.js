import React,{useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, FlatList, RefreshControl, Image, StyleSheet, Dimensions} from 'react-native';
import {useQuery} from '@apollo/react-hooks';
import {connect} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {COLOR, MEDIUM} from '../../../res/constants'
import {ActivitiesCard} from '../../components';
import {GET_DELIVERIES} from '../../../graphql';
import NoData from '../../../assets/images/NoData.png'
import DummyData from '../../components/DummyData';

const imageWidth = Dimensions.get('window').width - 200;

const AllActivities = ({navigation, session}) => {

  // const {data, loading, error, refetch} = useQuery(GET_DELIVERIES, {
  //   fetchPolicy: 'network-only',
  //   variables: {
  //     filter: {
  //       tokDriverId: session.user.driver.id,
  //       statusIn: [6],
  //     },
  //   },
  //   onError: (e) => {
  //     console.log(e);
  //   },
  // });

 

  // useFocusEffect(() => {
  // refetch();
  // }, []);

  // if (loading) {
  //   return (
  //     <View style={styles.center}>
  //       <ActivityIndicator size={24} color={COLOR} />
  //     </View>
  //   );
  // }

  // if (error) {
  //   return <SomethingWentWrong />;
  // }

  // if (data.getDeliveries.length === 0) {
  //   return (
  //     <View style={styles.center}>
  //       <Image source={NoData} style={styles.image} resizeMode={'contain'} />
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={DummyData.all.getDeliveries}
        // data={data.getDeliveries}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl   colors={[COLOR]} tintColor={COLOR} />}
            renderItem={({item, index}) => (  
            <ActivitiesCard
              delivery={item}
              onPress={() =>
                navigation.push('SelectedBookingDetails', {delivery: item, label: ['Booking', 'Details']})
              }
            // lastItem={data.getDeliveries.length == index + 1 ? true : false}
          />
          )}
      />
    </View>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(AllActivities);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: imageWidth,
    width: imageWidth,
  },
  text: {
    color: MEDIUM,
    marginTop: 20,
    fontFamily: 'Rubik-Medium',
  },
});
