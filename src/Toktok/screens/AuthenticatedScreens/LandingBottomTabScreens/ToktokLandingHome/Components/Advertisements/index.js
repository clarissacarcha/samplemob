import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useQuery} from '@apollo/react-hooks';
import {GET_ADVERTISEMENTS} from '../../../../../../../graphql';
import {SIZE, COLOR} from '../../../../../../../res/variables';

import Banner from './Banner';
import Grid from './Grid';

export const Advertisements = ({Header, HeaderSearchField, Menu, setUserLocation, constants}) => {
  const [banner, setBanner] = useState(null);
  const [grid, setGrid] = useState(null);

  const {data, loading, error} = useQuery(GET_ADVERTISEMENTS, {
    fetchPolicy: 'network-only',
    onCompleted: ({getAdvertisements}) => {
      const bannerAd = getAdvertisements.filter(ad => {
        return ad.isHighlighted;
      });

      const gridAds = getAdvertisements.filter(ad => {
        return !ad.isHighlighted;
      });

      setBanner(bannerAd);
      setGrid(gridAds);
    },
  });

  if (loading) return <View style={styles.separator} />;

  if (error) return <View style={styles.separator} />;

  return (
    <View>
      <Grid
        ads={grid}
        Header={Header}
        HeaderSearchField={HeaderSearchField}
        Menu={Menu}
        setUserLocation={setUserLocation}
        constants={constants}
        Banner={() => <Banner ads={banner} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: SIZE.MARGIN / 2,
    backgroundColor: COLOR.LIGHT,
  },
});
