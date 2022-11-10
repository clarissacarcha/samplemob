/* eslint-disable no-shadow */
/**
 * @format
 * @flow
 */

import React, {useState} from 'react';
import type {PropsType} from './types';
import {Container, PromotionHeader, ShopList} from './Styled';
import {
  ListContainer,
  ListImg,
  ListInfo,
  ListInfoText,
  MapIcon,
  Row,
  TimeImg,
  Overlay,
  OverlayText,
} from 'toktokfood/compositions/Home/HomeNearYou/Styled';
import StyledText from 'toktokfood/components/StyledText';
import {useRoute, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {shop_noimage} from 'toktokfood/assets/images';
import {getWeekDay} from 'toktokfood/helper/strings';

const ToktokFoodHomePromotionScreen = (props: PropsType): React$Node => {
  const route = useRoute();
  const navigation = useNavigation();
  const {item = {}} = route.params;
  const {name = '', shopsWithPromo = []} = item;

  const renderTitle = () => {
    if (name.length < 20) {
      return name;
    }
    return `${name.substring(0, 20)}...`;
  };

  const onShopOverview = item => navigation.navigate('ToktokFoodShopOverview', {item});

  const RestaurantList = ({item}) => {
    const [validImg, setValidImg] = useState(true);
    const {hasOpen, nextOperatingHrs, operatingHours, dayLapsed, hasProduct} = item;
    const {fromTime: currFromTime} = operatingHours;

    const displayNextOpeningHours = () => {
      if (hasOpen && hasProduct) {
        return null;
      }
      if (nextOperatingHrs === null || !hasProduct) {
        return <OverlayText>Currently Unavailable</OverlayText>;
      }
      const isAboutToOpen = moment().isBefore(moment(currFromTime, 'HH:mm:ss'));
      if (isAboutToOpen || dayLapsed === 0) {
        return (
          <OverlayText left={33}>
            Opens at {moment(dayLapsed === 0 ? nextOperatingHrs?.fromTime : currFromTime, 'hh:mm:ss').format('hh:mm A')}
          </OverlayText>
        );
      }
      return (
        <OverlayText left={16}>
          Opens on {getWeekDay(nextOperatingHrs?.day)} {moment(nextOperatingHrs?.fromTime, 'hh:mm:ss').format('LT')}
        </OverlayText>
      );
    };

    return (
      <ListContainer activeOpacity={0.9} onPress={() => onShopOverview(item)}>
        <ListImg source={validImg ? {uri: item.logo} : shop_noimage} onError={() => setValidImg(false)} />
        <Overlay opacity={hasOpen && hasProduct ? 0 : 0.68} />
        {displayNextOpeningHours()}
        <ListInfo>
          <StyledText textProps={{numberOfLines: 1}} mode="semibold">
            {item.shopname}
          </StyledText>

          <Row marginTop={5}>
            <TimeImg />
            <ListInfoText>{item.estimatedDeliveryTime} mins</ListInfoText>

            <MapIcon />
            <ListInfoText>
              {item.estimatedDistance.indexOf('KM') === -1 ? `${item.estimatedDistance} km` : item.estimatedDistance}
            </ListInfoText>
          </Row>
        </ListInfo>
      </ListContainer>
    );
  };

  return (
    <React.Fragment>
      <PromotionHeader title={renderTitle()} />
      <Container>
        <ShopList
          data={shopsWithPromo}
          keyExtractor={item => item.id}
          renderItem={({item}) => <RestaurantList item={item} />}
        />
      </Container>
    </React.Fragment>
  );
};

export default ToktokFoodHomePromotionScreen;
