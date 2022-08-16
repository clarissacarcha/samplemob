import React from 'react';
import {Text, StyleSheet, Image, View, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import {useDispatch} from 'react-redux';
import ProtectionIMG from '../../../../assets/images/Protection.png';
import CONSTANTS from '../../../../common/res/constants';
import {ThrottledOpacity} from '../../../../components_section';

const FULLSCREEN_HEIGHT = Dimensions.get('window').height;
export const PassengerCapacityActionSheet = ({details, confirmBooking}) => {
  const seatsArray = ['Just me', 'Two of us', 'Three of us', 'Four of us', 'Five of us'];

  const ShowSeats = () => {
    const showSeatsArray = seatsArray.splice(0, details?.vehicleType?.availableSeats);

    return showSeatsArray.map((value, index) => {
      const lastItem = index == showSeatsArray.length - 1 ? true : false;
      return (
        <View style={{alignItems: 'center'}}>
          <View style={styles.divider} />
          <ThrottledOpacity delay={500} onPress={() => confirmBooking(index + 1)} key={index}>
            <Text>{value}</Text>
          </ThrottledOpacity>
          {lastItem && <View style={styles.divider} />}
        </View>
      );
    });
  };

  return (
    <ActionSheet id="passenger_capacity" overlayColor="none">
      <View style={styles.container}>
        <Image source={ProtectionIMG} resizeMode={'contain'} style={styles.dimensions} />
        <Text style={styles.title}>Passenger Capacity</Text>
        <Text style={styles.description}>
          To ensure social distancing, we are limiting the number of passengers on each vehicle.
        </Text>
        <Text style={styles.description}>How many of you are taking this ride?</Text>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
          {ShowSeats()}
        </ScrollView>
      </View>

      <View style={{width: '100%', height: 10, backgroundColor: 'white', position: 'absolute', bottom: 0}} />
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    height: FULLSCREEN_HEIGHT * 0.52,
    right: 4,
    width: '102%',
    borderWidth: 3,
    borderTopColor: CONSTANTS.COLOR.ORANGE,
    borderLeftColor: CONSTANTS.COLOR.ORANGE,
    borderRightColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 15,
    // backgroundColor: 'red',
    padding: 28,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  dimensions: {
    width: 53,
    height: 65,
  },
  title: {
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.XL + 3,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    margin: 20,
  },
  description: {
    textAlign: 'center',
    fontSize: CONSTANTS.FONT_SIZE.M,
    marginBottom: 20,
  },
  scrollContainer: {
    alignSelf: 'stretch',
  },
  divider: {
    borderBottomWidth: 2,
    height: 2,
    width: '60%',
    borderBottomColor: CONSTANTS.COLOR.LIGHT,
    marginVertical: 16,
  },
});
