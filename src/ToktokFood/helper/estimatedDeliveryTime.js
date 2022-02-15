import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

export const saveEstimatedDeliveryTime = async (referenceNum, edt) => {
  try {
    const storedData = await AsyncStorage.getItem('ESTIMATED_DELIVERY_TIME');
    const parseData = JSON.parse(storedData);
    let data = {}
    if(parseData){
      data = { ...parseData, [referenceNum]: edt }
    }
    return await AsyncStorage.setItem('ESTIMATED_DELIVERY_TIME', JSON.stringify(data));
  } catch (err) {
    throw err;
  }
};

export const getEstimatedDeliveryTime = async (referenceNum) => {
  try {
    const data = await AsyncStorage.getItem('ESTIMATED_DELIVERY_TIME');
    if (data && Object.keys(data).length > 0) {
      let parsedData = JSON.parse(data);
      return parsedData[referenceNum] ? parsedData[referenceNum] : null;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

export const removeAllEstimatedDeliveryTime = async () => {
  try {
    return await AsyncStorage.removeItem('ESTIMATED_DELIVERY_TIME');
  } catch (err) {
    throw err;
  }
};
export const removeEstimatedDeliveryTime = async (referenceNum) => {
  try {
    const data = await AsyncStorage.getItem('ESTIMATED_DELIVERY_TIME');
    if (data && Object.keys(data).length > 0) {
      const parsedData = JSON.parse(data);
      if(parsedData && parsedData[referenceNum]){
        delete parsedData[referenceNum];
      }
      return 'success'
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

export const changeDateToday = (date) => {
  let newDate = '';
  if(date){
    let splitDate = date.split(' ')
    let dateToday = moment().format('YYYY-MM-DD')
    newDate = moment(`${dateToday} ${splitDate[1]}`).format('YYYY-MM-DD HH:mm:ss')
  }
  return date ? newDate : date
};

export const processGetEDT = async (date, referenceNum) => {
  let edt = await getEstimatedDeliveryTime(referenceNum);
  if (edt !== 'Invalid date') {
    let edtDate = convertEDT(date, edt)
    let hoursDifference = moment().diff(edtDate, 'hours', true)
    let final = moment(edtDate)
      .add(hoursDifference + 0.0166667, 'hours')
      .format('h:mm A');
    let edtHMMA = moment(edt, 'h:mm a');
    return moment().isAfter(edtHMMA) ? final : edt;
  } else {
    return null;
  }
};

export const convertEDT = (date, edt) => {
  let splitDate = date.split(' ')[0]
  let edtToHHMMSS = moment(edt, ["h:mm A"]).format("HH:mm");
  let edtDate = moment(`${splitDate} ${edtToHHMMSS}`)
  return edtDate
}