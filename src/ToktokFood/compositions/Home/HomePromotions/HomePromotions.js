/**
 * @format
 * @flow
 */

import React, {useState} from 'react';
import type {PropsType} from './types';
import {
  Container,
  Row,
  ShopList,
  LoaderContainer,
  ImageLoader,
  LoaderColumn,
  LoaderRow,
  ShopNameText,
  Separator,
} from './Styled';
import {
  TitleContainer,
  TimeImg,
  Overlay,
  OverlayText,
  ListContainer,
  ListImg,
  ListInfo,
  ListInfoText,
  MapIcon,
} from '../HomeNearYou/Styled';
import {SeeAllContainer, RightIcon} from '../HomeCategories/Styled';
import StyledText from 'toktokfood/components/StyledText';
import {useGetShopsPromotions} from 'toktokfood/hooks';
import ContentLoader from 'react-native-easy-content-loader';
import moment from 'moment';
import {getWeekDay} from 'toktokfood/helper/strings';
import {useNavigation} from '@react-navigation/native';
import {shop_noimage} from 'toktokfood/assets/images';
import Divider from 'toktokfood/components/Divider';
import {useTheme} from 'styled-components';

const HomePromotions = (props: PropsType): React$Node => {
  const navigation = useNavigation();
  const theme = useTheme();
  const {shopPromotions, shopPromotionLoading} = useGetShopsPromotions();

  const onShopOverview = item => navigation.navigate('ToktokFoodShopOverview', {item});
  const onSeeAll = item => navigation.navigate('ToktokFoodHomePromotionScreen', {item});

  if (shopPromotionLoading) {
    return (
      <LoaderContainer>
        <ContentLoader active title={false} pRows={1} pWidth={'50%'} pHeight={13} />
        <LoaderRow>
          {[1, 2, 3].map(l => (
            <LoaderColumn>
              <ImageLoader />
              <LoaderColumn>
                <ContentLoader active title={false} pRows={1} pWidth={120} pHeight={13} />
                <ContentLoader active title={false} pRows={1} pWidth={100} pHeight={11} />
              </LoaderColumn>
            </LoaderColumn>
          ))}
        </LoaderRow>
      </LoaderContainer>
    );
  }

  const RestaurantItem = ({item}) => {
    const [validImg, setValidImg] = useState(true);
    const {hasOpen, nextOperatingHrs, operatingHours, dayLapsed, hasProduct} = item;
    const {fromTime: currFromTime} = operatingHours;

    const displayNextOpeningHours = () => {
      if (hasOpen && hasProduct) {
        return null;
      }
      if (nextOperatingHrs === null || !hasProduct) {
        return (
          <OverlayText top="29%" left="21%">
            Currently{'\n'}Unavailable
          </OverlayText>
        );
      }
      const isAboutToOpen = moment().isBefore(moment(currFromTime, 'HH:mm:ss'));
      if (isAboutToOpen || dayLapsed === 0) {
        return (
          <OverlayText top="33%" left="9%">
            Opens at {moment(dayLapsed === 0 ? nextOperatingHrs?.fromTime : currFromTime, 'hh:mm:ss').format('hh:mm A')}
          </OverlayText>
        );
      }
      return (
        <OverlayText top="29%" left="17%">
          Opens on {getWeekDay(nextOperatingHrs?.day)}
          {'\n'}
          {moment(nextOperatingHrs?.fromTime, 'hh:mm:ss').format('LT')}
        </OverlayText>
      );
    };

    return (
      <ListContainer promo activeOpacity={0.9} onPress={() => onShopOverview(item)}>
        <ListImg promo source={validImg ? {uri: item.logo} : shop_noimage} onError={() => setValidImg(false)} />
        <Overlay promo opacity={hasOpen && hasProduct ? 0 : 0.68} />
        {/* {displayNextOpeningHours()} */}
        <ListInfo>
          <ShopNameText>{item.shopname}</ShopNameText>
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

  if (shopPromotions.length > 0) {
    return (
      <Container>
        {shopPromotions.map(promos => (
          <React.Fragment>
            <Row>
              <TitleContainer marginTop={15} flex={1} justifyContent="space-between">
                <StyledText textProps={{numberOfLines: 1}} mode="semibold">
                  {promos.voucherName.length < 20 ? promos.voucherName : `${promos.voucherName.substring(0, 20)}...`}
                </StyledText>
                <SeeAllContainer onPress={() => onSeeAll(promos)}>
                  <StyledText color={theme.color.orange}>See All</StyledText>
                  <RightIcon />
                </SeeAllContainer>
              </TitleContainer>
            </Row>
            <ShopList
              data={promos?.shopsWithPromo?.slice(0, 7)}
              keyExtractor={item => item.id}
              renderItem={({item}) => <RestaurantItem item={item} />}
              ItemSeparatorComponent={() => <Separator />}
            />
            <Divider height={8} />
          </React.Fragment>
        ))}
      </Container>
    );
  }

  return null;
};

export default HomePromotions;
