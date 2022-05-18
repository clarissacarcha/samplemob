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
    title = '',
    titleStyle,
    CenterComponent,
    RightComponent,
    LeftComponent,
    hasBack,
    backButtonFn,
    barStyle = 'default',
    backButtonColor,
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
      containerStyle={containerStyle}
      leftComponent={renderLeftComponent()}
      centerComponent={renderCenterComponent()}
      rightComponent={renderRightComponent()}
      barStyle={barStyle}
    />
  );
};

export default Header;
