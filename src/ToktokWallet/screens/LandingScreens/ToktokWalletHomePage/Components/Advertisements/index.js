import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_ADVERTISEMENT_CATEGORIES} from 'toktokwallet/graphql';
import Banner from './Banner';
import Grid from './Grid';
import Slider from './Slider';
import CONSTANTS from 'common/res/constants';

const {MARGIN, COLOR, FONT_SIZE, FONT_FAMILY: FONT} = CONSTANTS;

export const Advertisements = ({refreshing}) => {
  const [banner, setBanner] = useState(null);
  const [grid, setGrid] = useState(null);
  const [ads, setAds] = useState([]);

  const [getAdvertisement, {loading, error}] = useLazyQuery(GET_ADVERTISEMENT_CATEGORIES, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({getAdvertisementCategories}) => {
      setAds(getAdvertisementCategories);
    },
  });

  useEffect(() => {
    getAdvertisement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (refreshing) {
      getAdvertisement();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshing]);

  // if (loading) return <View style={styles.separator} />;

  // if (error) return <View style={styles.separator} />;

  return (
    <View>
      {/* <Banner ads={banner} />
        <Grid ads={grid} /> */}
      {/* {
          grid && grid.length > 0 && <>
          <View style={{paddingHorizontal: 16,marginBottom: 16}}>
          <Text style={{
            fontSize: FONT_SIZE.M,
            color: '#212529',
            fontFamily: FONT.BOLD,
          }}>Watch out for the best services you deserve</Text>
          </View>
          <Slider ads={grid}/>
          </>
        } */}
      {ads.map(ad => {
        if (ad.advertisement.length === 0) {
          return null;
        }
        return (
          <>
            <View style={styles.separator} />
            <View style={{padding: 16}}>
              <Text
                style={{
                  fontSize: FONT_SIZE.M,
                  color: '#212529',
                  fontFamily: FONT.BOLD,
                }}>
                {ad.description}
              </Text>
            </View>
            <View style={{paddingBottom: 16}}>
              <Slider bannerType={ad.bannerType} ads={ad.advertisement} />
            </View>
          </>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: MARGIN.M / 2,
    backgroundColor: COLOR.LIGHT,
  },
});
