/* eslint-disable no-shadow */
/**
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {useWindowDimensions} from 'react-native';
import type {PropsType} from './types';
import {ActivitiesHeader, ActivitiesTabBar, TabBarText, TabBarTextContainer} from './Styled';
import {TabView} from 'react-native-tab-view';
import {AllOrdersTab, OngoingOrdersTab, CompletedOrdersTab, CancelledOrdersTab} from './tabs';
import {useIsFocused, useRoute} from '@react-navigation/native';

const ORDER_STATUS = [
  {key: '1', title: 'All'},
  {key: '2', title: 'Ongoing'},
  {key: '3', title: 'Completed'},
  {key: '4', title: 'Cancelled'},
];

const ToktokFoodActivities = (props: PropsType): React$Node => {
  const layout = useWindowDimensions();
  const route = useRoute();
  const isFocused = useIsFocused();
  const [index, setIndex] = useState(0);
  const [routes] = useState(ORDER_STATUS);

  useEffect(() => {
    if (isFocused) {
      const orderStatusFromRoute = route.params?.orderStatus;
      if (orderStatusFromRoute === 's') {
        setIndex(2);
      } else if (orderStatusFromRoute === 'c') {
        setIndex(3);
      }
    }
  }, [isFocused, route.params?.orderStatus]);

  return (
    <React.Fragment>
      <ActivitiesHeader />
      <TabView
        navigationState={{index, routes}}
        renderScene={({route}) => {
          switch (route.key) {
            case '1':
              return <AllOrdersTab />;
            case '2':
              return <OngoingOrdersTab />;
            case '3':
              return <CompletedOrdersTab />;
            case '4':
              return <CancelledOrdersTab />;
            default:
              return null;
          }
        }}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={props => (
          <ActivitiesTabBar
            renderLabel={({route, focused}) => (
              <TabBarTextContainer focused={focused}>
                <TabBarText focused={focused}>{route.title}</TabBarText>
              </TabBarTextContainer>
            )}
            {...props}
          />
        )}
        lazy
      />
    </React.Fragment>
  );
};

export default ToktokFoodActivities;
