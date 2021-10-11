import AsyncStorage from '@react-native-community/async-storage';
export const saveRiderDetails = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('show_rider_details', jsonValue)

    return { status: 200, message: 'success' }
  } catch (e) {
    return { status: 500, message: 'failed' }
  }
}
export const checkRiderDetails = async (referenceNum) => {
  try {
    const storeData = await AsyncStorage.getItem('show_rider_details')
 
    let filterData = []
    if(storeData && storeData.length > 0){
      let parseData = JSON.parse(storeData);
      filterData = parseData.filter((item) => { return item == referenceNum })
    }
  
    if(filterData.length == 0){
      console.log(filterData.length == 0)
      let riderDetails = await getRiderDetails()
      let data = riderDetails.concat(referenceNum)
      return await saveRiderDetails(data)
    }
    return []
  } catch (e) {
    console.log(e)
    return []
  }
}

export const getRiderDetails = async () => {
  try {
    const storeData = await AsyncStorage.getItem('show_rider_details')
    if(storeData != null){
      return JSON.parse(storeData);
    }
    return []
  } catch (e) {
    return []
  }
}
export const removeRiderDetails = async(referenceNum, isLastItem) => {
  try {
    let storeData = await AsyncStorage.getItem('show_rider_details')
    if(storeData != null){
      let riderDetails = JSON.parse(storeData);
      delete riderDetails[referenceNum]
    console.log(riderDetails, 'asdasdasdas')

      let res = await saveRiderDetails(riderDetails)
      return res
    }
    return { status: 200, message: 'success' }
  } catch(exception) {
    return { status: 500, message: 'failed' }
  }
}

export const clearRiderDetails = async(key) => {
  try {
    await AsyncStorage.removeItem('show_rider_details');
    return true;
  } catch(exception) {
    return false;
  }
}
