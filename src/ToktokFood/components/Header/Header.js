/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {NHeader, BackButton} from './Styled';

import StyledText from 'toktokfood/components/StyledText';

import {useNavigation} from '@react-navigation/native';

const Header = (props: PropsType): React$Node => {
  // const context = useContext(GlobalContext);
  const {
    containerStyle,
    centerContainerStyle,
    leftContainerStyle,
    title = '',
    titleStyle,
    CenterComponent,
    RightComponent,
    LeftComponent,
    hasBack,
    barStyle = 'default',
    backButtonFn,
    backButtonColor,
    backgroundColor,
    icon,
  } = props;
  const navigation = useNavigation();

  const renderCenterComponent = () => {
    return (
      CenterComponent || (
        <StyledText textProps={{numberOfLines: 1}} mode="semibold" style={titleStyle}>
          {title}
        </StyledText>
      )
    );
  };

  const handleBackButton = () => {
    if (backButtonFn) {
      backButtonFn();
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
        navigation.setParams({orderStatus: undefined});
      } else {
        navigation.navigate('TabsStack', {screen: 'Communities'});
      }
    }
  };

  const renderLeftComponent = () => {
    if (hasBack) {
      return <BackButton icon={icon} color={backButtonColor} onPress={handleBackButton} />;
    }

    return LeftComponent ? <LeftComponent /> : null;
  };

  const renderRightComponent = () => {
    return RightComponent ? <RightComponent /> : null;
  };

  return (
    <NHeader
      backgroundColor={backgroundColor}
      containerStyle={containerStyle}
      centerContainerStyle={centerContainerStyle}
      leftContainerStyle={leftContainerStyle}
      leftComponent={renderLeftComponent()}
      centerComponent={renderCenterComponent()}
      rightComponent={renderRightComponent()}
      barStyle={barStyle}
    />
  );
};

export default Header;
