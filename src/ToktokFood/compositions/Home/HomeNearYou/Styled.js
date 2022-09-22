/**
 * @flow
 */

import type {ComponentType} from 'react';
import {FlatList, Image} from 'react-native';
import styled from 'styled-components/native';
import {Icon} from 'react-native-elements';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ContentLoader from 'react-native-easy-content-loader';

import StyledText from 'toktokfood/components/StyledText';

import {getDeviceWidth, scale} from 'toktokfood/helper/scale';
import {time} from 'toktokfood/assets/images';

export const Container: ComponentType<any> = styled.View`
  background-color: ${props => props.theme.color.white};
  flex: 1;
`;

export const Row: ComponentType<any> = styled.View`
  /* border-width: 1px; */
  align-items: center;
  flex-direction: row;
  padding-vertical: 3px;
`;

export const ListContainer: ComponentType<any> = styled.TouchableOpacity`
  background-color: ${props => props.theme.color.white};
  /* border-width: 1px; */
  width: ${getDeviceWidth / 2 - 25};
  height: 200px;
  margin: 8px;
`;

export const ListInfo: ComponentType<any> = styled.View`
  /* border-width: 1px; */
  flex: 1;
  padding-top: 5px;
`;

export const ListWrapper: ComponentType<any> = styled.TouchableOpacity`
  background-color: ${props => props.theme.color.white};
  flex-direction: row;
  flex: 1;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  /* border-width: 1px; */
`;

export const ListImg: ComponentType<any> = styled.Image`
  border-radius: 10px;
  width: 180px;
  height: 160px;
`;

export const ListInfoText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
}))`
  margin-horizontal: 5px;
`;

export const MapIcon: ComponentType<any> = styled(MCIcon).attrs(props => ({
  ...props,
  name: 'map-marker-outline',
  color: props.theme.color.yellow,
  size: 15,
}))``;

export const TimeImg: ComponentType<any> = styled(Image).attrs(props => ({
  ...props,
  source: time,
  resizeMode: 'contain',
}))`
  width: 13px;
  height: 13px;
`;

export const TitleContainer: ComponentType<any> = styled.View`
  padding-horizontal: ${scale(15)};
  justify-content: space-between;
  flex-direction: row;
  /* border-width: 1px; */
  padding-vertical: 5px;
  /* padding-horizontal: 15px; */
`;

export const SeeAllContainer: ComponentType<any> = styled.TouchableOpacity`
  justify-content: space-between;
  flex-direction: row;
  width: 60px;
`;

export const RightIcon: ComponentType<any> = styled(Icon).attrs(props => ({
  ...props,
  name: props.icon || 'chevron-forward-outline',
  type: 'ionicon',
  color: props.color || props.theme.color.orange,
  size: 15,
}))``;

export const NearYouList: ComponentType<any> = styled(FlatList).attrs(props => ({
  ...props,
  scrollEnabled: false,
  //   horizontal: true,
  contentContainerStyle: {
    borderWidth: 1,
    // alignItems: 'center',
    // paddingVertical: 5,
  },
}))``;

// Loader
export const ContentLoading: ComponentType<any> = styled(ContentLoader).attrs(props => ({
  ...props,
  active: true,
  title: false,
  pRows: 1,
  pHeight: [180],
  pWidth: ['90%', '10%', '30%'],
  // primaryColor: props.theme.color.yellow,
  // secondaryColor: 'rgba(256,186,28,0.4)',
  aShape: 'square',
  aSize: 180,
  avatar: true,
  listSize: 5,
  // loading: false,
  containerStyles: {
    // borderWidth: 1,
    marginHorizontal: 7,
  },
  paragraphStyles: {
    // borderWidth: 1,
    bottom: 5,
    marginLeft: 3,
  },
}))``;
