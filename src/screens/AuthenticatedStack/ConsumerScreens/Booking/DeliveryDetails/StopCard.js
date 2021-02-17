import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';
import {CardShadow, CardHeader, CardBody, CardRow, Hairline, SizedBox} from '../../../../../components/widgets';

const StopCard = ({
  stopData,
  orderType,
  scheduledDate,
  label,
  headerIconSet,
  headerIconName,
  headerIconSize = 16,
  marginTop,
  marginBottom,
}) => {
  console.log({stopData});
  const {name, mobile, latitude, longitude, formattedAddress, landmark} = stopData; //also contains orderType

  const navigation = useNavigation();

  const onPress = throttle(
    () => {
      navigation.push('StopDetails', {stopData, orderType, scheduledDate});
    },
    1000,
    {trailing: false},
  );

  return (
    <>
      {marginTop && <SizedBox />}
      <CardShadow>
        <CardHeader
          label={label}
          iconSet={headerIconSet}
          iconName={headerIconName}
          iconSize={headerIconSize}
          paddingVertical={15}
        />

        <CardBody onPress={onPress}>
          <CardRow
            value={formattedAddress ? formattedAddress : 'Address'}
            iconSet="Entypo"
            iconName="location"
            minHeight={40}
            iconMarginTop={6}
          />

          <Hairline />
          <CardRow
            title={name ? name : 'Contact Person'}
            value={mobile ? `+63${mobile}` : 'Mobile Number'}
            iconSet="Material"
            iconName="person"
            iconSize={22}
            minHeight={40}
            iconMarginTop={6}
          />

          {landmark !== '' && (
            <>
              <Hairline />
              <CardRow
                value={landmark}
                iconSet="FontAwesome5"
                iconName="landmark"
                iconSize={14}
                minHeight={40}
                iconMarginTop={6}
              />
            </>
          )}
        </CardBody>
      </CardShadow>
      {marginBottom && <SizedBox />}
    </>
  );
};

export default StopCard;
