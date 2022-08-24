import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import CONSTANTS from 'common/res/constants';
import {moderateScale, numFormatter} from 'toktokwallet/helper';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

const Header = ({headerData}) => {
  const getCellWidth = index => {
    switch (index) {
      case 0:
        return '25%';
      case 1:
        return '30%';
      case 2:
        return '13%';
      case 3:
        return '15%';
      case 4:
        return '17%';
    }
  };

  return (
    <View style={styles.headerContainer}>
      {headerData.map((header, index) => {
        let cellwidth = getCellWidth(index);
        return (
          <View style={{width: cellwidth}}>
            <Text style={styles.headerText}>{header}</Text>
          </View>
        );
      })}
    </View>
  );
};

const PaymentChart = ({paymentChart}) => {
  return (
    <View style={styles.paymentChartContainer}>
      {paymentChart.map((details, index) => {
        return (
          <View
            style={{...styles.paymentChartSubContainer, ...{backgroundColor: index % 2 === 1 ? 'white' : '#FFF4EB'}}}>
            <View style={styles.cell25}>
              <Text style={styles.paymentChartText}>{details.partnerName}</Text>
            </View>
            <View style={styles.cell100}>
              {details.paymentChartRanges.map((range, ind) => {
                const {from, to, fee, toktokServiceFee, rate} = range;
                const computedFee = `${parseFloat(fee) + parseFloat(toktokServiceFee)} + ${rate}%`;

                return (
                  <View
                    style={{
                      ...styles.rangeContainer,
                      ...{marginBottom: ind === details.paymentChartRanges.length - 1 ? 0 : 5},
                    }}>
                    <View style={styles.cell30}>
                      <Text style={styles.paymentChartText}>
                        ₱{numFormatter(from)} - ₱{numFormatter(to)}
                      </Text>
                    </View>
                    <View style={styles.cell13}>
                      <Text style={styles.paymentChartText}>
                        {details.partnerType.name === 'Over the Counter' ? `₱${computedFee}` : '--'}
                      </Text>
                    </View>
                    <View style={styles.cell15}>
                      <Text style={styles.paymentChartText}>
                        {details.partnerType.name === 'Online Bank' ? `₱${computedFee}` : '--'}
                      </Text>
                    </View>
                    <View style={styles.cell17}>
                      <Text style={{...styles.paymentChartText, ...styles.textCenter}}>
                        {details.partnerType.name === 'Payment thru Mobile/E-Wallet' ? `₱${computedFee}` : '--'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export const CustomTable = ({headerData = [], rowsData = [], data = []}) => {
  return (
    <ScrollView style={styles.container}>
      {data.map(item => {
        const {paymentChart} = item;
        if (paymentChart.length === 0) return null;
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.service}>{item.description}</Text>
            <Header headerData={headerData} />
            <PaymentChart paymentChart={paymentChart} />
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: moderateScale(20),
  },
  contentContainer: {
    marginBottom: moderateScale(20),
  },
  service: {
    fontFamily: FONT.BOLD,
    marginBottom: moderateScale(10),
  },
  headerContainer: {
    flexDirection: 'row',
    flexShrink: 1,
    backgroundColor: COLOR.ORANGE,
    borderTopLeftRadius: moderateScale(5),
    borderTopRightRadius: moderateScale(5),
    alignItems: 'center',
    padding: moderateScale(10),
  },
  headerText: {
    fontSize: FONT_SIZE.S,
    fontFamily: FONT.SEMI_BOLD,
    marginHorizontal: moderateScale(5),
    color: COLOR.WHITE,
  },
  paymentChartContainer: {
    marginVertical: moderateScale(10),
  },
  paymentChartSubContainer: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(20),
    alignItems: 'center',
    borderRadius: moderateScale(5),
  },
  paymentChartText: {
    fontSize: FONT_SIZE.S,
    marginHorizontal: moderateScale(5),
  },
  rangeContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  cell25: {
    width: '25%',
  },
  cell100: {
    width: '100%',
  },
  cell13: {
    width: '13%',
  },
  cell17: {
    width: '17%',
  },
  cell30: {
    width: '30%',
  },
  cell15: {
    width: '15%',
  },
});
