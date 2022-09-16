/**
 * @format
 * @flow
 */

import React, {useState} from 'react';

import type {PropsType} from './types';
import {CloseIcon, FAB, FABIcon} from './Styled';

// Assets
import {fab_activities, fab_food, fab_notification, fab_wallet} from 'toktokfood/assets/images';

const fabItems = [
  {label: 'toktokwallet', image: fab_wallet},
  {label: 'Notifications', image: fab_notification},
  {label: 'Activities', image: fab_activities},
];

const HomeFab = (props: PropsType): React$Node => {
  const [isOpen, setIsOpen] = useState(false);

  const renderItemIcon = item => <FABIcon source={item.image} />;

  const renderMenuIcon = menuState => {
    const {dimmerActive} = menuState;
    return dimmerActive ? <CloseIcon /> : <FABIcon source={fab_food} />;
  };

  return (
    <FAB
      items={fabItems}
      isOpen={isOpen}
      onMenuToggle={() => setIsOpen(!isOpen)}
      renderMenuIcon={renderMenuIcon}
      renderItemIcon={renderItemIcon}
    />
  );
};

export default HomeFab;
