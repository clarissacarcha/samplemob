import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useQuery} from '@apollo/react-hooks';
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql';
import {GET_ADVERTISEMENTS} from 'toktokwallet/graphql';
import Banner from './Banner';
import Grid from './Grid';
import Slider from './Slider';
import CONSTANTS from 'common/res/constants'

const { MARGIN , COLOR } = CONSTANTS

export const Advertisements = () => {
  const [banner, setBanner] = useState(null);
  const [grid, setGrid] = useState(null);

  const {data, loading, error} = useQuery(GET_ADVERTISEMENTS, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({getAdvertisements}) => {
      const bannerAd = getAdvertisements.filter((ad) => {
        return ad.isHighlighted;
      });

      const gridAds = getAdvertisements.filter((ad) => {
        return !ad.isHighlighted;
      });

      setBanner(bannerAd);
      // setGrid(gridAds);
      setGrid(getAdvertisements)
    },
  });

  if (loading) return <View style={styles.separator} />;

  if (error) return <View style={styles.separator} />;

  return (
    <View>
      <View style={styles.separator} />
      <View style={{marginVertical: 16}}>
        {/* <Banner ads={banner} />
        <Grid ads={grid} /> */}
        {
          grid && <Slider ads={grid}/>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: MARGIN.M / 2,
    backgroundColor: COLOR.LIGHT,
    marginTop: 16,
  },
});
