/**
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {Avatar, withBadge} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import type {PropsType} from './types';
import {BadgeContainer, CloseIcon, FAB, FABIcon} from './Styled';

// Assets
import {fab_activities, fab_food, fab_notification, fab_wallet} from 'toktokfood/assets/images';

const fabItems = [
  // {label: 'toktokwallet', image: fab_wallet}, remove for now
  {label: 'Notifications', image: fab_notification},
  {label: 'Activities', image: fab_activities},
];

const HomeFab = (props: PropsType): React$Node => {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();

  const handlePressedSelection = (item, index) => {
    if (item.label === 'Activities') {
      navigation.navigate('ToktokFoodActivities');
    }
  };

  const BadgedIcon = withBadge(' ')(Avatar);

  const Badge = () => (
    <BadgeContainer>
      <BadgedIcon imageProps={{resizeMode: 'contain'}} source={fab_food} size="small" />
      {/* <Avatar rounded imageProps={{resizeMode: 'contain'}} source={fab_food} size="small" /> */}
      {/* <IconBadge /> */}
      {/* <Badge status="success" /> */}
    </BadgeContainer>
  );

  const renderItemIcon = item => <FABIcon source={item.image} />;

  const renderMenuIcon = menuState => {
    const {dimmerActive} = menuState;
    return dimmerActive ? <CloseIcon /> : <Badge />;
  };

  return (
    <FAB
      items={fabItems}
      isOpen={isOpen}
      onMenuToggle={() => setIsOpen(!isOpen)}
      renderMenuIcon={renderMenuIcon}
      renderItemIcon={renderItemIcon}
      onItemPress={handlePressedSelection}
    />
  );
};

export default HomeFab;
