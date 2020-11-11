import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CardShadow, CardHeader, CardBody, CardRow, Hairline} from '../../../../../components/widgets';

const StopCard = ({onPress, label, headerIconSet, headerIconName, headerIconSize = 16}) => {
  return (
    <CardShadow onPress={onPress}>
      <CardHeader label={label} iconSet={headerIconSet} iconName={headerIconName} iconSize={headerIconSize} />

      <CardBody>
        <CardRow
          value="#1521 Minerva Street, Parada, Santa Maria, Bulacan"
          iconSet="Entypo"
          iconName="location"
          minHeight={40}
          iconMarginTop={6}
        />

        <Hairline />
        <CardRow
          title="Alvir Marquez"
          value="+639151234567"
          iconSet="Material"
          iconName="person"
          iconSize={22}
          minHeight={40}
          iconMarginTop={6}
        />

        <Hairline />
        <CardRow
          value="Total Gas Station"
          iconSet="FontAwesome5"
          iconName="landmark"
          iconSize={14}
          minHeight={40}
          iconMarginTop={6}
        />
      </CardBody>
    </CardShadow>
  );
};

export default StopCard;

const styles = StyleSheet.create({});
