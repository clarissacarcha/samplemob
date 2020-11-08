/**
 * Displayed in Selected Delivery Details
 * Used to display Delivery Logs
 */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import _ from 'lodash';
import {COLOR, DARK, MEDIUM, LIGHT, ORANGE} from '../res/constants';
import {YellowIcon} from '../components/ui';

import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';

const screenWidth = Dimensions.get('window').width;

const getImageDimensions = (uri) => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => {
        resolve({width: width, height: height});
      },
      (error) => {
        reject(error);
      },
    );
  });
};

const StatusBar = ({number, label, log, tempFile}) => {
  const [imageDimension, setImageDimension] = useState(null);

  let ts = '--/--/---- - --:-- --';
  const hasImageBox = [4, 6].includes(number);
  let hasImage;

  if (log) {
    ts = log.createdAt;

    hasImage = log.image !== null ? true : false;
  }

  const getImage = async () => {
    const result = await getImageDimensions(log.image);
    const width = screenWidth - 40 - 40 - 34; // outer padding, inner padding, leftMargin

    const height = (width / result.width) * result.height;

    setImageDimension({
      width,
      height,
    });
  };

  useEffect(() => {
    if (hasImage) {
      getImage();
    }
  }, [hasImage]);

  return (
    <View style={{marginBottom: 20}}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={[styles.numberBox, {borderRadius: 100}]}>
            <Text style={{color: 'white', fontFamily: 'Rubik-Medium'}}>{number}</Text>
          </View>
          <Text style={{marginLeft: 10, color: DARK, fontFamily: 'Rubik-Medium'}}>
            {label[0]}
            <Text style={{color: ORANGE}}> {label[1]}</Text>
          </Text>
        </View>
        <Text style={{color: MEDIUM, fontSize: 10}}>{ts}</Text>
      </View>
      {hasImageBox && hasImage && imageDimension && (
        <Image
          source={{uri: log.image}}
          style={{
            height: imageDimension.height,
            marginTop: 20,
            marginLeft: 34,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}
          resizeMode="cover"
        />
      )}
      {hasImageBox && !hasImage && (
        <View
          style={{
            height: 200,
            backgroundColor: LIGHT,
            marginTop: 20,
            marginLeft: 34,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}>
          <FAIcon name="picture-o" size={40} color={'white'} />
        </View>
      )}
    </View>
  );
};

export const DeliveryLogsCard = ({logs}) => {
  const mappedLogs = _.mapKeys(logs, 'status');

  return (
    <View style={styles.card}>
      <View style={styles.cardShadow}>
        <View
          style={{
            flexDirection: 'row',
            padding: 20,
            alignItems: 'center',
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: MEDIUM,
          }}>
          <YellowIcon set="MaterialCommunity" name="format-list-bulleted" size={20} darkIcon />
          <Text style={{marginLeft: 10, color: DARK, fontFamily: 'Rubik-Medium'}}>
            Delivery <Text style={{color: ORANGE}}>Logs</Text>
          </Text>
        </View>

        <View style={{padding: 20, paddingBottom: 0}}>
          <StatusBar number={1} label={['Order', 'Placed']} log={mappedLogs['1']} />
          <StatusBar number={2} label={['Scheduled', 'for Delivery']} log={mappedLogs['2']} />
          <StatusBar number={3} label={['On the Way', 'to Sender']} log={mappedLogs['3']} />
          <StatusBar number={4} label={['Item', 'Picked Up']} log={mappedLogs['4']} />
          <StatusBar number={5} label={['On the Way', 'to Recipient']} log={mappedLogs['5']} />
          <StatusBar number={6} label={['Item', 'Delivered']} log={mappedLogs['6']} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
  },
  cardShadow: {
    paddingBottom: 0,
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
  iconBoxDark: {
    backgroundColor: COLOR,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  numberBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
